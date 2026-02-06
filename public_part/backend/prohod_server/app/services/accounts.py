import uuid

from fastapi import HTTPException
from sqlalchemy import select
from starlette import status

from app.api.schemas import ChangePasswordRequest
from app.models import Account, RoleEnum, User
import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    flag = bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    return flag


class AccountsService:
    def __init__(self, request, db):
        self.request = request
        self.db = db

    async def create_account(self, role: str):
        if self.db.query(Account).filter(Account.login == self.request.login).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Login already exists")

        user_id = uuid.uuid4()
        account_id = uuid.uuid4()
        password = str(uuid.uuid4())[:8]
        user = User(
            id=user_id,
            name=self.request.account_info.name,
            surname=self.request.account_info.surname,
            user_email=self.request.account_info.user_email,
            role=role,
        )
        account = Account(
            id=account_id,
            user=user,
            login=self.request.login,
            password_hash=hash_password(password),
            user_status="active"
        )
        self.db.add(user)
        self.db.add(account)
        self.db.commit()
        return self.request.login, password, user_id

    async def change_password(self):
        account = self.db.execute(select(Account).where(Account.login == self.request.login)).scalars().first()
        if not account:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
        if not verify_password(self.request.current_password, account.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect current password")
        if self.request.new_password != self.request.confirm_new_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New passwords do not match")
        account.password_hash = hash_password(self.request.new_password)
        self.db.commit()
        return {"message": "Password successfully changed"}

    async def update_password(self):
        account = self.db.execute(select(Account).where(Account.login == self.request.login)).scalars().first()
        if not account:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
        if self.request.new_password != self.request.confirm_new_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New passwords do not match")
        account.password_hash = hash_password(self.request.new_password)
        self.db.commit()
        return {"message": "Password successfully changed"}

    async def deactivate_user(self):
        account = self.db.execute(select(Account).where(Account.id == self.request.id)).scalars().first()
        account.user_status = "inactive"
        self.db.commit()

    async def activate_user(self):
        account = self.db.execute(select(Account).where(Account.id == self.request.id)).scalars().first()
        account.user_status = "active"
        self.db.commit()
