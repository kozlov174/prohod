from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.sql import literal
from app.database import get_session
from app.models import Form, VisitRequest  # Убедитесь, что путь к модели forms правильный

reports_router = APIRouter(prefix="/reports", tags=["reports"])


@reports_router.post("/reports/", )
def get_visit_request_report(
        start_date: datetime,
        end_date: datetime,
        db: Session = Depends(get_session)
):
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
        .filter(func.date(Form.visit_time) >= start_date)
        .filter(func.date(Form.visit_time) <= end_date)
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


