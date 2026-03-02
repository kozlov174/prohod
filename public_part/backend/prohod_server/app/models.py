import enum
import uuid
from psycopg2._psycopg import Boolean
from sqlalchemy import Enum, ForeignKey, String, Text, TIMESTAMP, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RoleEnum(enum.Enum):
    user = "user"
    security = "security"
    admin = "admin"
    post = "post"


class VisitRequestStatusEnum(enum.Enum):
    not_processed = "not_processed"
    reject = "reject"
    accept = "accept"
    user_accept = "user_accept"

class EmailRequestStatusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    surname: Mapped[str] = mapped_column(String, nullable=False)
    user_email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum), nullable=False)

    accounts: Mapped[list["Account"]] = relationship("Account", back_populates="user")
    forms: Mapped[list["Form"]] = relationship("Form", back_populates="user_to_visit")
    # processed_requests: Mapped[list["VisitRequest"]] = relationship(
    #     "VisitRequest", back_populates="processed_by_user"
    # )


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    associated_user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )
    login: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    password_hash: Mapped[bytes] = mapped_column(Text, nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="accounts")
    user_status: Mapped[str] = mapped_column(String, nullable=False)


class Form(Base):
    __tablename__ = "forms"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    user_to_visit_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )
    passport_full_name: Mapped[str] = mapped_column(Text, nullable=False)
    passport_series: Mapped[str] = mapped_column(String, nullable=False)
    passport_number: Mapped[str] = mapped_column(String, nullable=False)
    passport_who_issued: Mapped[str] = mapped_column(Text, nullable=False)
    passport_issue_date: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, nullable=False)
    passport_photo: Mapped[str] = mapped_column(Text, nullable=False)
    visit_time: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, nullable=False)
    visit_reason: Mapped[str] = mapped_column(Text, nullable=False)
    email_to_send_reply: Mapped[str] = mapped_column(String, nullable=False)

    user_to_visit: Mapped["User"] = relationship("User", back_populates="forms")
    visit_requests: Mapped[list["VisitRequest"]] = relationship(
        "VisitRequest", back_populates="form"
    )


class VisitRequest(Base):
    __tablename__ = "visit_requests"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    form_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("forms.id"), nullable=False)
    who_processed_user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    who_processed_security_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    status: Mapped[VisitRequestStatusEnum] = mapped_column(
        Enum(VisitRequestStatusEnum), default=VisitRequestStatusEnum.not_processed
    )
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)
    form: Mapped["Form"] = relationship("Form", back_populates="visit_requests")


class VerifyCodes(Base):
    __tablename__ = "verify_codes"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True)
    time: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    verification_code: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[EmailRequestStatusEnum] = mapped_column(Enum(EmailRequestStatusEnum), nullable=False, default=EmailRequestStatusEnum.active)