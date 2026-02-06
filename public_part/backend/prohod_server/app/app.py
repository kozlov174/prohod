from fastapi import FastAPI

from app.api.routers.v1 import api_router
from app.config import app_config

app = FastAPI(
    title=app_config.TITLE,
    version=app_config.VERSION,
    description=app_config.DESCRIPTION,
)
app.include_router(api_router)
