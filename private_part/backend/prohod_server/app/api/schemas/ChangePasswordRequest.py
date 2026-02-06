from pydantic import BaseModel

class ChangePasswordRequest(BaseModel):
    login: str
    current_password: str
    new_password: str
    confirm_new_password: str
