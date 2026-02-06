from datetime import datetime
from urllib import request

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.schemas.visit import (
    VisitRequestCreate,
    VisitRequestListResponse,
    VisitRequestResponse,
)
from app.database import get_session
from app.models import VisitRequest, VisitRequestStatusEnum, Form

visit_router = APIRouter(prefix="/visit", tags=["Visit"])


@visit_router.post(
    "/visit-requests/",
    response_model=VisitRequestResponse,
)
def create_visit_request(
        request: VisitRequestCreate,
        db: Session = Depends(get_session),
):
    db_request = VisitRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@visit_router.get(
    "/visit-requests/",
    response_model=VisitRequestListResponse,
)
def get_visit_requests(
        status: VisitRequestStatusEnum = None,
        db: Session = Depends(get_session),
):
    query = db.query(VisitRequest)
    if status:
        query = query.filter(VisitRequest.status == status)
    visit_requests = query.all()
    return {"visit_requests": visit_requests}


@visit_router.post(
    "/visit-requests/{request_id}/accept",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
def accept_visit_request(
        request_id: UUID,
        user_id: UUID,  # ID пользователя, который принимает заявку
        db: Session = Depends(get_session),
):
    request = db.query(VisitRequest).filter(VisitRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Request not found"
        )

    # Проверяем, кто принимает заявку: пользователь или охранник
    if not request.who_processed_user_id:
        request.who_processed_user_id = user_id
    elif not request.who_processed_security_id:
        request.who_processed_security_id = user_id

    # Проверяем, оба ли пользователя приняли заявку
    if request.who_processed_user_id and request.who_processed_security_id:
        request.status = VisitRequestStatusEnum.accept

    db.commit()
    return {"message": "Request accepted"}


@visit_router.post("/visit-requests/{request_id}/reject", response_model=dict)
def reject_visit_request(
        request_id: UUID,
        user_id: UUID,  # ID пользователя, который отклоняет заявку
        rejection_reason: str,
        db: Session = Depends(get_session),
):
    request = db.query(VisitRequest).filter(VisitRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Request not found"
        )

    # Если заявка уже отклонена, ничего не делаем
    if request.status == VisitRequestStatusEnum.reject:
        return {"message": "Request already rejected"}

    # Проверяем, кто отклоняет заявку: пользователь или охранник
    if not request.who_processed_user_id:
        request.who_processed_user_id = user_id
    elif not request.who_processed_security_id:
        request.who_processed_security_id = user_id

    # Если хотя бы один из пользователей отклонил заявку, она становится отклоненной
    request.status = VisitRequestStatusEnum.reject
    request.rejection_reason = rejection_reason

    db.commit()
    return {"message": "Request rejected"}

@visit_router.post("/get_report/{start_date}/{end_date}", response_model=dict)
def get_visit_request_report(
    start_date: datetime, end_date: datetime, db: Session = Depends(get_session),
):
    request = db.query(Form).filter(Form.visit_time >= start_date).filter(Form.visit_time <= end_date).all()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Request not found"
        )

    return {"requests": request}
