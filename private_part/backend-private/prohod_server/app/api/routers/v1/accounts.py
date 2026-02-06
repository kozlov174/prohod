import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import providers
from app.api.schemas.ChangePasswordRequest import ChangePasswordRequest
from app.api.schemas.ChangeUserStatus import ChangeUserStatus
from app.api.schemas.accounts import (
    AccountCreateRequest, AccountCreateResponse, LoginRequest, LoginResponse
)
from app.api.schemas.updatePasswordRequest import UpdatePasswordRequest
from app.api.schemas.users import UserInfo
from app.database import get_session
from app.middlewares import get_current_user
from app.models import Account, User
from app.services.accounts import AccountsService, verify_password
from app.api.schemas import updatePasswordRequest

from app.models import RoleEnum

from app.services.message_sender import EmailQrCodeSender

accounts_router = APIRouter(prefix="/accounts", tags=["Accounts"])


@accounts_router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
)
async def login(
        request: LoginRequest,
        db: Session = Depends(get_session),
):
    account = db.query(Account).filter(Account.login == request.login).first()
    if not account or not verify_password(request.password, account.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = account.user
    if account.user_status == "inactive":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    # Проверяем роль пользователя
    if user.role == RoleEnum.user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied for this role")

    # Создаем экземпляр JWT провайдера
    jwt_provider = providers.get_user_auth_provider()
    jwt_token = jwt_provider.get_token(user)  # Передаем объект пользователя

    return {
        "user": user,
        "jwtToken": jwt_token,
    }


# @accounts_router.post(
#     "/security/create",
#     response_model=AccountCreateResponse,
# )
# async def create_security_account(
#         request: AccountCreateRequest,
#         db: Session = Depends(get_session),
# ):
#     if db.query(Account).filter(Account.login == request.login).first():
#         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Login already exists")
#
#     user_id = str(uuid.uuid4())
#     account_id = str(uuid.uuid4())
#     password = str(uuid.uuid4())[:8]
#     user = User(
#         id=user_id,
#         name=request.account_info.name,
#         surname=request.account_info.surname,
#         user_email=request.account_info.user_email,
#         role=Role.SECURITY,
#     )
#     account = Account(
#         id=account_id,
#         user_id=user_id,
#         login=request.login,
#         password_hash=hash_password(password),
#     )
#     db.add(user)
#     db.add(account)
#     db.commit()
#     return {"login": request.login, "password": password}


@accounts_router.post(
    "/create/{role}",
    response_model=AccountCreateResponse,
)
async def create_user_account(
        role: str,
        request: AccountCreateRequest,
        db: Session = Depends(get_session),
):
    _login, _password, _user_id = await AccountsService(request, db).create_account(role)
    _user_id = str(_user_id)
    sender = EmailQrCodeSender()
    if role == RoleEnum.user.value:
        sender.send_account_created(str(request.account_info.user_email), _login, _password)
    return {
        "login": _login, "password": _password, "id": _user_id
    }


@accounts_router.post(
    "/change-password",
    response_model=dict)
async def change_password(
        request: ChangePasswordRequest,
        db: Session = Depends(get_session),
):
    account_service = await AccountsService(request, db).change_password()
    return account_service


@accounts_router.post(
    "/reset_password",
    response_model=dict
)
async def reset_password_for_admin(
        request: UpdatePasswordRequest,
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_session),
):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,  # Код ошибки "Forbidden"
            detail="You is not admin"
        )
    account_service = await AccountsService(request, db).update_password()

    return account_service


@accounts_router.get("/get_me", response_model=UserInfo)
async def get_me(
        db: Session = Depends(get_session),
        current_user: dict = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    return user


@accounts_router.post("/deactivate_user", response_model=dict)
def deactivate_user(
        request: ChangeUserStatus,
        db: Session = Depends(get_session),
        current_user: dict = Depends(get_current_user),
):
    if current_user["role"] == "user":
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to deactivate account"
        )
    account_service = AccountsService(request, db)
    account_service.deactivate_user()
    return {"status": "deactivated"}


@accounts_router.post("/activate_user", response_model=dict)
def activate_user(
        request: ChangeUserStatus,
        db: Session = Depends(get_session),
        current_user: dict = Depends(get_current_user),
):
    if current_user["role"] == "user":
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to activate account"  # Обновлено сообщение
        )
    account_service = AccountsService(request, db)
    account_service.activate_user()
    return {"status": "activated"}
