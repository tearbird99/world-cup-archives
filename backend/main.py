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

DATA_DIR = Path(__file__).parent / "data" / "players"


@app.get("/api/players/{player_id}/total")
def get_player_total(player_id: int):
    path = DATA_DIR / "total" / f"{player_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Player not found")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/players/{player_id}/{year}")
def get_player_by_year(player_id: int, year: int):
    path = DATA_DIR / str(year) / f"{player_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Player not found")
    return json.loads(path.read_text(encoding="utf-8"))