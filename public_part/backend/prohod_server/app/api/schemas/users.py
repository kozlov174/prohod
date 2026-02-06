import uuid
from typing import List

from pydantic import BaseModel, UUID4

from app.models import RoleEnum


class UserInfo(BaseModel):
    id: UUID4
    name: str
    surname: str
    user_email: str
    role: RoleEnum

    class Config:
        orm_mode = True

class UserSpecialInfo(BaseModel):
    id: str
    name: str
    surname: str
    user_email: str
    role: str
    login: str

    class Config:
        orm_mode = True


class UserListResponse(BaseModel):
    users: List[UserInfo]

class SecuritiesListResponse(BaseModel):
    securities: List[UserInfo]


class UserSpecialListResponse(BaseModel):
    users: List[UserSpecialInfo]

class SecuritiesSpecialListResponse(BaseModel):
    securities: List[UserSpecialInfo]