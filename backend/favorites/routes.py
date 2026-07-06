"""
즐겨찾기 관련 라우터
- GET    /api/favorites                          : 내 즐겨찾기 전체 목록 조회
- POST   /api/favorites                          : 즐겨찾기 추가
- DELETE /api/favorites/{target_type}/{target_id} : 즐겨찾기 삭제
"""
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Favorite, User
from auth.dependencies import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

TargetType = Literal["player", "team"]


class FavoriteCreateRequest(BaseModel):
    target_type: TargetType
    target_id: str


class FavoriteResponse(BaseModel):
    id: int
    target_type: str
    target_id: str

    class Config:
        from_attributes = True


@router.get("", response_model=list[FavoriteResponse])
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )


@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    payload: FavoriteCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = Favorite(
        user_id=current_user.id,
        target_type=payload.target_type,
        target_id=payload.target_id,
    )
    db.add(favorite)
    try:
        db.commit()
    except IntegrityError:
        # UniqueConstraint(user_id, target_type, target_id)에 걸린 경우 - 이미 즐겨찾기됨
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 즐겨찾기에 추가된 항목입니다.",
        )
    db.refresh(favorite)
    return favorite


@router.delete("/{target_type}/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    target_type: TargetType,
    target_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.target_type == target_type,
            Favorite.target_id == target_id,
        )
        .first()
    )
    if favorite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="즐겨찾기 항목을 찾을 수 없습니다.",
        )
    db.delete(favorite)
    db.commit()