"""
인증 관련 유틸 함수
- 구글 ID Token 검증
- 자체 JWT 발급 / 검증
"""
import os
from datetime import datetime, timedelta, timezone

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from jose import jwt, JWTError

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24 * 7  # 7일

if not GOOGLE_CLIENT_ID:
    raise RuntimeError("GOOGLE_CLIENT_ID 환경변수가 설정되지 않았습니다.")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY 환경변수가 설정되지 않았습니다.")


def verify_google_token(token: str) -> dict:
    """
    프론트엔드에서 받은 구글 ID Token을 검증하고,
    유효하면 유저 정보(dict)를 반환한다.
    유효하지 않으면 ValueError를 발생시킨다.

    반환값 예시:
    {
        "sub": "1234567890",      # 구글 고유 사용자 ID
        "email": "user@gmail.com",
        "name": "홍길동",
        "picture": "https://..."
    }
    """
    idinfo = id_token.verify_oauth2_token(
        token, google_requests.Request(), GOOGLE_CLIENT_ID
    )

    # 발급자가 구글이 맞는지 재확인 (라이브러리 내부에서도 확인하지만 명시적으로 한 번 더)
    if idinfo["iss"] not in ("accounts.google.com", "https://accounts.google.com"):
        raise ValueError("잘못된 토큰 발급자입니다.")

    return idinfo


def create_access_token(user_id: int) -> str:
    """
    우리 서비스 자체 JWT 발급.
    payload에는 최소 정보(user_id)만 담는다.
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> int:
    """
    JWT를 검증하고 user_id(int)를 반환한다.
    유효하지 않으면 JWTError를 발생시킨다.
    """
    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    user_id = payload.get("sub")
    if user_id is None:
        raise JWTError("토큰에 sub 클레임이 없습니다.")
    return int(user_id)