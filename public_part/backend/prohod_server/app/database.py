from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import app_config


engine = create_engine(
    f'postgresql://'
    f'{app_config.POSTGRES_USER}:'
    f'{app_config.POSTGRES_PASSWORD}@'
    f'{app_config.POSTGRES_HOST}:'
    f'{app_config.POSTGRES_PORT}/'
    f'{app_config.POSTGRES_DB}',
)
Base = declarative_base()
Session = sessionmaker(engine, expire_on_commit=False)


def get_session() -> Generator:
    with Session() as session:
        yield session
