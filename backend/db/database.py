"""
데이터베이스 연결 설정 (SQLAlchemy engine, session)
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요."
    )

# 'postgresql://' 인식
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI 의존성 주입용 DB 세션 제공 함수.
    라우터에서 Depends(get_db)로 사용.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()