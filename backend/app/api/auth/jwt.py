from fastapi import APIRouter, HTTPException   
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.services.user_services import UserService
from app.core.security import create_access_token


auth_router = APIRouter()


@auth_router.post("/login")
async def login(login: OAuth2PasswordRequestForm = Depends())-> Any:
    user = await UserService.authenticate(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tncorrect email or password"
        )

    return {
        "access_token": create_access_token(user.user_id),
        "refresh_token": create_refresh_token(user.user_id),

    }    