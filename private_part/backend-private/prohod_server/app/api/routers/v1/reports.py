from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.sql import literal
from app.database import get_session
from app.models import Form, VisitRequest
from io import BytesIO
from datetime import datetime
import pandas as pd
from typing import Optional

reports_router = APIRouter(prefix="/reports", tags=["reports"])


@reports_router.post("/json_report/")
def get_visit_request_json_report(
    start_date: datetime = Query(..., description="Start datetime (ISO)"),
    end_date: datetime = Query(..., description="End datetime (ISO)"),
    db: Session = Depends(get_session)
):
    """
    Возвращает список форм/запросов внутри диапазона дат в JSON.
    """
    # приводим к date для сравнения с func.date(...)
    start_date_only = start_date.date()
    end_date_only = end_date.date()

    requests = (
        db.query(
            Form.id,
            Form.user_to_visit_id,
            Form.passport_full_name,
            Form.passport_series,
            Form.passport_number,
            Form.passport_who_issued,
            Form.passport_issue_date,
            literal("").label("passport_photo"),  # Пустое значение для passport_photo
            Form.visit_time,
            Form.visit_reason,
            Form.email_to_send_reply,
            VisitRequest.id.label("visit_request_id")
        )
        .join(
            VisitRequest,
            Form.id == VisitRequest.form_id,
            isouter=True
        )
        .filter(func.date(Form.visit_time) >= start_date_only)
        .filter(func.date(Form.visit_time) <= end_date_only)
        .all()
    )

    if not requests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No requests found in the specified date range"
        )

    formatted_requests = [
        {
            "id": row.id,
            "user_to_visit_id": row.user_to_visit_id,
            "passport_full_name": row.passport_full_name,
            "passport_series": row.passport_series,
            "passport_number": row.passport_number,
            "passport_who_issued": row.passport_who_issued,
            "passport_issue_date": row.passport_issue_date,
            "passport_photo": row.passport_photo,  # Уже пустое значение
            "visit_time": row.visit_time,
            "visit_reason": row.visit_reason,
            "email_to_send_reply": row.email_to_send_reply,
            "visit_request_id": row.visit_request_id,
        }
        for row in requests
    ]

    return {"forms": formatted_requests}


@reports_router.post("/excel_report/")
def get_visit_request_excel_report(
    start_date: datetime = Query(..., description="Start datetime (ISO)"),
    end_date: datetime = Query(..., description="End datetime (ISO)"),
    db: Session = Depends(get_session)
) -> StreamingResponse:
    """
    Возвращает Excel-файл с формами/запросами внутри диапазона дат.
    """
    start_date_only = start_date.date()
    end_date_only = end_date.date()

    # 1️⃣ Получаем данные из БД
    requests = (
        db.query(
            Form.id,
            Form.user_to_visit_id,
            Form.passport_full_name,
            Form.passport_series,
            Form.passport_number,
            Form.passport_who_issued,
            Form.passport_issue_date,
            literal("").label("passport_photo"),  # пустое значение
            Form.visit_time,
            Form.visit_reason,
            Form.email_to_send_reply,
            VisitRequest.id.label("visit_request_id")
        )
        .join(VisitRequest, Form.id == VisitRequest.form_id, isouter=True)
        .filter(func.date(Form.visit_time) >= start_date_only)
        .filter(func.date(Form.visit_time) <= end_date_only)
        .all()
    )

    if not requests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No requests found in the specified date range"
        )

    # 2️⃣ Преобразуем в pandas DataFrame
    rows = []
    for row in requests:
        rows.append({
            "ID": row.id,
            "User to Visit ID": row.user_to_visit_id,
            "Full Name": row.passport_full_name,
            "Passport Series": row.passport_series,
            "Passport Number": row.passport_number,
            "Issued By": row.passport_who_issued,
            "Issue Date": row.passport_issue_date,
            "Passport Photo": row.passport_photo,
            "Visit Time": row.visit_time,
            "Visit Reason": row.visit_reason,
            "Reply Email": row.email_to_send_reply,
            "Visit Request ID": row.visit_request_id,
        })

    df = pd.DataFrame(rows)

    # 3️⃣ Записываем DataFrame в Excel в памяти
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name="Visit Requests")
    output.seek(0)

    # 4️⃣ Возвращаем файл как StreamingResponse
    filename = f"visit_report_{start_date_only}_{end_date_only}.xlsx"
    content_disposition = f'attachment; filename="{filename}"'

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": content_disposition
        }
    )
