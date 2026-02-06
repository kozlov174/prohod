from fastapi import APIRouter


from .accounts import accounts_router
from .reports import reports_router
from .users import users_router
from .verify_email import verify_email_router
from .visit_security import visit_security_router
from .visit_user import visit_user_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(accounts_router)
api_router.include_router(users_router)
# api_router.include_router(visit_security_router)
# api_router.include_router(reports_router)
api_router.include_router(visit_user_router)
api_router.include_router(verify_email_router)