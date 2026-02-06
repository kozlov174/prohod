from pydantic import BaseModel, Field

from app.models import RoleEnum
from .users import UserInfo


class JWT(BaseModel):
    value: str = Field()


class LoginRequest(BaseModel):
    login: str = Field(description="Логин пользователя")
    password: str = Field(description="Пароль пользователя")


class LoginResponse(BaseModel):
    user: UserInfo
    jwtToken: str


class AccountUserInfo(BaseModel):
    name: str = Field(..., max_length=50, description="Имя пользователя")
    surname: str = Field(..., max_length=50, description="Фамилия пользователя")
    user_email: str = Field(..., description="Электронная почта пользователя")


class AccountCreateRequest(BaseModel):
    account_info: AccountUserInfo
    login: str = Field(..., max_length=50, description="Логин учетной записи")


class AccountCreateResponse(BaseModel):
    login: str = Field(..., description="Логин учетной записи")
    password: str = Field(..., description="Пароль учетной записи (автоматически сгенерированное)")
    id: str = Field(..., description="Идентификатор учетной записи")


class AccountResponse(BaseModel):
    id: str = Field(..., description="Идентификатор учетной записи")
    login: str = Field(..., description="Логин учетной записи")
    user_id: str = Field(..., description="Идентификатор пользователя")
    role: RoleEnum

    class Config:
        orm_mode = True
