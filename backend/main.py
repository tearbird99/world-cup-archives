from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"
PLAYERS_DIR = DATA_DIR / "players"
TEAMS_DIR = DATA_DIR / "teams"
TEAM_SLUG_MAP_PATH = DATA_DIR / "team-slug-map.json"

# team_id(sofascore 원본 ID) -> slug ("brazil" 등). 서버 시작 시 한 번만 로드.
# 키는 JSON에서 문자열로 저장되어 있으므로 조회 시 str(team_id)로 변환해서 사용.
_team_slug_map: dict[str, str] = {}
if TEAM_SLUG_MAP_PATH.exists():
    _team_slug_map = json.loads(TEAM_SLUG_MAP_PATH.read_text(encoding="utf-8"))


def _slug_for_team(team_id: int) -> str:
    slug = _team_slug_map.get(str(team_id))
    if not slug:
        raise HTTPException(status_code=404, detail="Team not found")
    return slug


@app.get("/api/players/{player_id}/total")
def get_player_total(player_id: int):
    path = PLAYERS_DIR / "total" / f"{player_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Player not found")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/players/{player_id}/{year}")
def get_player_by_year(player_id: int, year: int):
    path = PLAYERS_DIR / str(year) / f"{player_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Player not found")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/teams/{team_id}")
def get_team_years_played(team_id: int):
    """
    이 팀이 실제로 출전 기록(통계 파일)이 존재하는 모든 연도 목록을 반환.
    프론트엔드 TeamDetail의 연도 탭 구성에 사용됨.
    data/teams/{year}/{slug}.json 파일이 있는 연도만 모아서 정렬해서 반환.
    """
    slug = _slug_for_team(team_id)

    years_played: list[int] = []
    if TEAMS_DIR.exists():
        for year_dir in TEAMS_DIR.iterdir():
            if not year_dir.is_dir() or not year_dir.name.isdigit():
                continue
            if (year_dir / f"{slug}.json").exists():
                years_played.append(int(year_dir.name))

    years_played.sort()
    return {"team_id": team_id, "slug": slug, "years_played": years_played}


@app.get("/api/teams/{team_id}/{year}")
def get_team_by_year(team_id: int, year: int):
    slug = _slug_for_team(team_id)
    path = TEAMS_DIR / str(year) / f"{slug}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Team not found")
    return json.loads(path.read_text(encoding="utf-8"))