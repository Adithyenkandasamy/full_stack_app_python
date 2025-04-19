from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user_schema import UserAuth, UserOut, UserUpdate
from app.services.user_service import UserService
import pymongo
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user



user_router = APIRouter()

@user_router.post("/create", summary = "Create new user", response_model=UserOut)
async def create_user(data: UserAuth):
    try:
        user = await UserService.create_user(data)
        return user
    except pymongo.errors.DuplicateKeyError: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
@user_router.get("/me", summary = "Get details of currently logged in user", response_model=UserOut)    
async def get_user_me(user: User = Depends(get_current_user)):
    return user

@user_router.post('/update', summary = "Update user", response_model=UserOut)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_user(user, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
