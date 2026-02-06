import uuid

from pydantic import BaseModel

class ChangeUserStatus(BaseModel):
    id: str
