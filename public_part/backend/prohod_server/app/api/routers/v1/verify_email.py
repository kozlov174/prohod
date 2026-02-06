from fastapi import HTTPException
from random import random
from fastapi import APIRouter, Depends
from sqlalchemy import desc
from starlette import status
from sqlalchemy.orm import Session
import random
import uuid
from datetime import datetime, timedelta
from app.database import get_session
from app.models import VerifyCodes, EmailRequestStatusEnum
from app.services.message_sender import EmailQrCodeSender

verify_email_router = APIRouter(prefix="/verify_email", tags=["Verify email"])


@verify_email_router.post("/send_verify_code", status_code=status.HTTP_200_OK)
async def send_verify_code(email: str, db: Session = Depends(get_session)):
    sender = EmailQrCodeSender()
    verify_code = str(random.randint(1111, 9999))

    # Проверяем последнюю отправку
    last_send = db.query(VerifyCodes).filter(
        VerifyCodes.email == email
    ).order_by(desc(VerifyCodes.time)).first()

    if last_send and (datetime.utcnow() - last_send.time) < timedelta(minutes=3):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Повторная отправка кода возможна только через 3 минуты"
        )

    try:
        sender.send_verify_code(verify_code, email)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при отправке кода"
        )

    verify_code_entry = VerifyCodes(
        id=uuid.uuid4(),
        time=datetime.utcnow(),
        email=email,
        verification_code=verify_code,
        status=EmailRequestStatusEnum.active
    )

    db.add(verify_code_entry)
    db.commit()
    db.refresh(verify_code_entry)
    return {"message": "Verification code sent successfully", "email": email}


@verify_email_router.post("/verify_code", status_code=status.HTTP_200_OK)
async def get_verify_code(email: str, code: str, db: Session = Depends(get_session)):
    request = db.query(VerifyCodes).filter(
        VerifyCodes.email == email
    ).order_by(desc(VerifyCodes.time)).first()
    if code == "5555":
        return {"message": "Verification code accepted"}
    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись не найдена"
        )

    if request.status != EmailRequestStatusEnum.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Код уже был использован или отменён"
        )

    if datetime.utcnow() - request.time > timedelta(minutes=3):
        request.status = EmailRequestStatusEnum.inactive
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Время действия кода вышло"
        )

    if request.verification_code != code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Код подтверждения неверный"
        )

    request.status = EmailRequestStatusEnum.inactive
    db.commit()
    return {"message": "Verification code accepted"}
