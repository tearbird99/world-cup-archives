"""
인증 관련 라우터
- POST /auth/google : 구글 ID Token을 받아 검증 후, 유저 upsert + 자체 JWT 발급
- GET  /auth/me      : 현재 로그인한 유저 정보 조회
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import User
from auth.utils import verify_google_token, create_access_token
from auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class GoogleLoginRequest(BaseModel):
    id_token: str  # 프론트엔드(@react-oauth/google)에서 받은 구글 ID Token


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    picture_url: str | None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


@router.post("/google", response_model=LoginResponse)
def login_with_google(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    # 1) 구글 ID Token 검증
    try:
        google_info = verify_google_token(payload.id_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 구글 토큰입니다.",
        )

    google_sub = google_info["sub"]
    email = google_info["email"]
    name = google_info.get("name", email)
    picture_url = google_info.get("picture")

    # 2) 기존 유저 조회 (google_sub 기준 - 이메일보다 안정적인 식별자)
    user = db.query(User).filter(User.google_sub == google_sub).first()

    if user is None:
        # 신규 유저 생성
        user = User(
            google_sub=google_sub,
            email=email,
            name=name,
            picture_url=picture_url,
        )
        db.add(user)
    else:
        # 기존 유저면 최신 프로필 정보로 갱신 (이름/사진 변경 대응)
        user.email = email
        user.name = name
        user.picture_url = picture_url

    db.commit()
    db.refresh(user)

    # 3) 자체 JWT 발급
    access_token = create_access_token(user_id=user.id)

    return LoginResponse(access_token=access_token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)