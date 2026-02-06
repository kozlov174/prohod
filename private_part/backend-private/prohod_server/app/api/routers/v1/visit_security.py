import uuid

from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from sqlalchemy import null
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.api.schemas.visit import (
    RejectRequest,
    VisitRequestCreate,
    VisitRequestListResponse,
    VisitRequestResponse,
)
from app.database import get_session
from app.middlewares import get_current_user
from app.models import VisitRequest, VisitRequestStatusEnum, User, Form
from app.services.message_sender import EmailQrCodeSender

visit_security_router = APIRouter(prefix="/visit-requests-for-security", tags=["Visit-for-security"])


# @visit_security_router.post(
#     "/visit-requests/",
#     response_model=dict,
# )
# def create_visit_request(request: VisitRequestCreate, db: Session = Depends(get_session)):
#     try:
#         # Создание формы (Form)
#         form = Form(
#             id=uuid.uuid4(),
#             user_to_visit_id=request.form.user_to_visit_id,
#             passport_full_name=request.form.passport_full_name,
#             passport_series=request.form.passport_series,
#             passport_number=request.form.passport_number,
#             passport_who_issued=request.form.passport_who_issued,
#             passport_photo=request.form.passport_photo,
#             passport_issue_date=request.form.passport_issue_date,
#             visit_time=request.form.visit_time,
#             visit_reason=request.form.visit_reason,
#             email_to_send_reply=request.form.email_to_send_reply,
#         )
#
#         # Добавление формы в сессию
#         db.add(form)
#         db.flush()  # Чтобы получить ID формы после добавления
#
#         # Создание запроса на посещение (VisitRequest) и связывание с формой
#         visit_request = VisitRequest(
#             id=uuid.uuid4(),
#             form_id=form.id,
#             rejection_reason=None,
#             who_processed_user_id=None,
#             who_processed_security_id=None,
#         )
#
#         # Добавление запроса на посещение в сессию
#         db.add(visit_request)
#
#         # Сохранение изменений в базе данных
#         db.commit()
#
#         return {
#             "status": "ok",
#         }
#
#     except IntegrityError as e:
#         db.rollback()
#         raise ValueError(f"Ошибка при создании записи: {e}")
#
#     except Exception as e:
#         db.rollback()
#         raise RuntimeError(f"Произошла ошибка: {e}")
#

@visit_security_router.get(
    "/visit-requests/",
    response_model=VisitRequestListResponse,
)
def get_visit_requests_by_status(
        status: VisitRequestStatusEnum,
        db: Session = Depends(get_session),
        user: User = Depends(get_current_user),
):
    if user["role"] == "user":
        raise HTTPException(
            status_code=403,  # Код ошибки "Forbidden"
            detail="Your network isn't correct"
        )
    query = db.query(VisitRequest)
    if status:
        query = query.filter(VisitRequest.status == status).filter(VisitRequest.who_processed_user_id.isnot(None)).options(joinedload(VisitRequest.form))
    visit_requests = query.all()
    for request in visit_requests:
        del request.who_processed_user_id
        del request.who_processed_security_id
    return {"visit_requests": visit_requests}


@visit_security_router.get(
    "/visit-requests/{id}",
    response_model=VisitRequestResponse,
)
def get_visit_request_by_id(
        id: str,
        db: Session = Depends(get_session)
):
    try:
        request_id = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Некорректный формат ID")

    query = db.query(VisitRequest).filter(VisitRequest.id == request_id).options(joinedload(VisitRequest.form))
    visit_request = query.one_or_none()

    if not visit_request:
        raise HTTPException(status_code=404, detail="Запрос на посещение не найден")

    return visit_request

@visit_security_router.post(
    "/visit-requests/{id}/accept",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
def accept_visit_request(
        id: str,
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_session),
):

    request = (db.query(VisitRequest)
               .options(
                   joinedload(VisitRequest.form).joinedload(Form.user_to_visit)
               )
               .filter(VisitRequest.id == id)
               .first())

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Request not found"
        )

    # Проверяем роль пользователя и проставляем соответствующее поле
    if current_user["role"] == "user":
        request.who_processed_user_id = current_user["user_id"]
    elif current_user["role"] == "security":
        request.who_processed_security_id = current_user["user_id"]
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to perform this action"
        )

    sender = EmailQrCodeSender()

    # Обновляем статус заявки в зависимости от действий обоих пользователей
    if request.who_processed_user_id and request.who_processed_security_id:
        if request.status != VisitRequestStatusEnum.reject:
            request.status = VisitRequestStatusEnum.accept
            # Передаем всю заявку вместо email
            sender.send_accept(id, request)

    db.commit()
    return {"message": "Request accepted"}


@visit_security_router.post(
    "/visit-requests/{request_id}/reject",
    response_model=dict,
    status_code=status.HTTP_200_OK,
)
async def reject_visit_request(
    request_id: str,
    reject_data: RejectRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    # Получаем заявку
    request = db.query(VisitRequest).filter(VisitRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Request not found"
        )

    # Проверяем роль пользователя и сохраняем, кто обработал
    if current_user["role"] == "user":
        request.who_processed_user_id = current_user["user_id"]
    elif current_user["role"] == "security":
        request.who_processed_security_id = current_user["user_id"]
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to perform this action",
        )

    # Устанавливаем причину и статус отказа
    request.rejection_reason = reject_data.rejection_reason
    request.status = VisitRequestStatusEnum.reject

    # Если оба обработали, и хотя бы один отказал — отправляем письмо с отказом
    if request.who_processed_user_id and request.who_processed_security_id:
        sender = EmailQrCodeSender()
        email = request.form.email_to_send_reply
        sender.send_reject(email, request.rejection_reason)

    db.commit()
    return {"message": "Request rejected"}


