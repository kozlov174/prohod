from fastapi import HTTPException, status


not_authenticated_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail={"msg": "Not authenticated."},
    headers={"WWW-Authenticate": "Bearer"},
)
credentials_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail={"msg": "Could not validate credentials."},
    headers={"WWW-Authenticate": "Bearer"},
)

permission_denied_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail={"msg": "Permission denied."},
    headers={"WWW-Authenticate": "Bearer"},
)
