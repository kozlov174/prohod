from pydantic import BaseModel


class UpdatePasswordRequest(BaseModel):
    login: str
    new_password: str
    confirm_new_password: str
