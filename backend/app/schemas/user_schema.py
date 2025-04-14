from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr




class UserAuth(BaseModel):
    email: EmailStr = Field(..., description="User email")
    username: str = Field(..., min_length=5, max_length=50, description="User username")
    password: str = Field(..., min_length=5, max_length=24, description="User password")

class UserOut(BaseModel):
    user_id: UUID
    username: str
    email: EmailStr
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    disabled: Optional[bool] = False
