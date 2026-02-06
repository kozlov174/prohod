import os

import jwt
from sqlalchemy import Enum

from app.exceptions import credentials_exception
from app.models import User


class JWTProvider:
    def __init__(self, secret_key_env_name: str):
        self.secret_key = "SECRET"

    def get_token(self, user: User):
        payload = self.get_payload(user)
        print("Generated JWT Payload:", payload)  # Отладочный вывод
        return jwt.encode(payload, self.secret_key, algorithm="HS256")

    def get_payload(self, user: User) -> dict:
        return {
            "user_id": str(user.id),
            "role": user.role.value,

        }

    def decode_access_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            print("Decoded payload:", payload)  # Отладочный вывод
            return payload
        except jwt.PyJWTError as e:
            print(f"Error decoding token: {e}")  # Логирование ошибки
            return {}

    def validate_token(self, token: str) -> str:
        try:
            jwt.decode(token, self.secret_key, algorithms=["HS256"])
            return token
        except jwt.PyJWTError:
            raise credentials_exception


class UserJWTProvider(JWTProvider):
    def __init__(self):
        super().__init__("USER_JWT_SECRET")

    def get_payload(self, user: User) -> dict:
        return {
            "user_id": str(user.id),
            "role": user.role.value,
        }



def get_user_auth_provider() -> JWTProvider:
    return UserJWTProvider()
