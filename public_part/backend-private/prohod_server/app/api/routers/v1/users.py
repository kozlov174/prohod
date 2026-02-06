from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.api.schemas.users import SecuritiesSpecialListResponse, UserListResponse, UserInfo, SecuritiesListResponse, \
    UserSpecialListResponse, UserSpecialInfo
from app.database import get_session
from app.middlewares import get_current_user
from app.models import Account, RoleEnum, User


users_router = APIRouter(prefix="/users", tags=["Users"])

@users_router.post("/users/", response_model=UserInfo)
def create_user(
        user: UserInfo,
        db: Session = Depends(get_session),
):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@users_router.get("/users/", response_model=UserSpecialListResponse)
def get_users(db: Session = Depends(get_session)):

    users = (
        db.query(User)
        .filter(User.role == RoleEnum.user)
        .options(joinedload(User.accounts))
        .all()
    )

    user_special_info_list = []
    for user in users:
        login = user.accounts[0].login if user.accounts else None
        user_info = UserSpecialInfo(
            id=str(user.id),  # Преобразуем UUID в строку
            name=user.name,
            surname=user.surname,
            user_email=user.user_email,
            role=user.role.value,  # Преобразуем Enum в строку
            login=login,
        )
        user_special_info_list.append(user_info)

    return {"users": user_special_info_list}

@users_router.get("/securities/", response_model=SecuritiesSpecialListResponse)
def get_securities(db: Session = Depends(get_session)):
    users = (
        db.query(User)
        .filter(User.role == RoleEnum.security)
        .options(joinedload(User.accounts))
        .all()
    )

    user_special_info_list = []
    for user in users:
        login = user.accounts[0].login if user.accounts else None
        user_info = UserSpecialInfo(
            id=str(user.id),  # Преобразуем UUID в строку
            name=user.name,
            surname=user.surname,
            user_email=user.user_email,
            role=user.role.value,  # Преобразуем Enum в строку
            login=login,
        )
        user_special_info_list.append(user_info)

    return {"securities": user_special_info_list}