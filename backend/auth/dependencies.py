"""
FastAPI 의존성 함수
- get_current_user: 요청 헤더의 JWT를 검증하고 현재 로그인한 User 객체를 반환
- get_current_user_optional: 로그인 여부가 필수는 아닌 엔드포인트용 (비로그인이면 None)
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import User
from auth.utils import decode_access_token

# Authorization: Bearer <token> 헤더에서 토큰을 추출해주는 스킴
# auto_error=False로 해서, 토큰이 아예 없는 경우 여기서 바로 에러 내지 않고
# 각 의존성 함수(get_current_user / get_current_user_optional)에서 상황에 맞게 처리
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    로그인이 필수인 엔드포인트에서 사용.
    토큰이 없거나 유효하지 않으면 401 에러 발생.

    사용 예:
        @app.post("/api/favorites")
        def add_favorite(current_user: User = Depends(get_current_user)):
            ...
    """
    unauthorized_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증이 필요합니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized_exc

    try:
        user_id = decode_access_token(credentials.credentials)
    except JWTError:
        raise unauthorized_exc

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise unauthorized_exc

    return user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    """
    로그인 여부가 선택적인 엔드포인트에서 사용.
    비로그인 상태거나 토큰이 유효하지 않으면 에러 대신 None 반환.

    사용 예 (팀/선수 상세 페이지 - 로그인 안 해도 조회는 가능하되,
    로그인했으면 '내가 즐겨찾기했는지' 여부도 같이 보여주고 싶을 때):
        @app.get("/api/teams/{team_id}")
        def get_team(current_user: User | None = Depends(get_current_user_optional)):
            ...
    """
    if credentials is None:
        return None

    try:
        user_id = decode_access_token(credentials.credentials)
    except JWTError:
        return None

    return db.query(User).filter(User.id == user_id).first()