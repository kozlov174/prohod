import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, UUID4

from app.models import VisitRequestStatusEnum


class VisitRequestBase(BaseModel):
    user_to_visit_id: str
    visit_time: datetime
    visit_reason: str


class Form(BaseModel):
    user_to_visit_id: uuid.UUID
    passport_full_name: str
    passport_series: str
    passport_number: str
    passport_who_issued: str
    passport_issue_date: datetime
    passport_photo: str
    visit_time: datetime
    visit_reason: str
    email_to_send_reply: str

    class Config:
        orm_mode = True


class VisitRequestCreate(BaseModel):
    form: Form

    class Config:
        orm_mode = True


class VisitRequestResponse(BaseModel):
    id: uuid.UUID
    form: Form
    status: VisitRequestStatusEnum
    rejection_reason: Optional[str]

    class Config:
        orm_mode = True


class VisitRequestListResponse(BaseModel):
    visit_requests: List[VisitRequestResponse]


class FormsListResponse(BaseModel):
    forms: List[Form]


class UserForm(BaseModel):
    user_to_visit_id: uuid.UUID
    passport_full_name: str
    visit_time: datetime
    visit_reason: str
    email_to_send_reply: str

    class Config:
        orm_mode = True


class VisitRequestUserResponse(BaseModel):
    id: uuid.UUID
    form: UserForm
    status: VisitRequestStatusEnum

    class Config:
        orm_mode = True


class VisitRequestListUserResponse(BaseModel):
    visit_requests: List[VisitRequestUserResponse]

class RejectRequest(BaseModel):
    rejection_reason: str