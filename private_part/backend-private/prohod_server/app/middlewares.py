from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.providers import JWTProvider, get_user_auth_provider

# Используем только HTTPBearer для JWT авторизации
auth_scheme = HTTPBearer()


async def validate_user(token: str, auth_provider: JWTProvider):
    token_data = auth_provider.decode_access_token(token)

    role = token_data.get("role")
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    return token_data


async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(auth_scheme),
        auth_provider: JWTProvider = Depends(get_user_auth_provider),
) -> dict:
    return await validate_user(credentials.credentials, auth_provider)


async def validate_token(
        credentials: HTTPAuthorizationCredentials = Security(auth_scheme),
        auth_provider: JWTProvider = Depends(get_user_auth_provider),
) -> str:
    return auth_provider.validate_token(credentials.credentials)
