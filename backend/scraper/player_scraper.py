"""
Sofascore World Cup Player Stats Scraper
- FIFA World Cup unique_tournament_id = 16
- 대상 연도: 1966 ~ 2022 (4년 주기)
- 결과: data/players/{year}/{player_id}.json
- season ID는 data/season-ids.json 에서 로드
- 봇 탐지 우회: curl_cffi (Chrome TLS 핑거프린트) + 랜덤 딜레이 + 지수 백오프

엔드포인트:
  1) /unique-tournament/16/season/{sid}/statistics?limit=100&offset=N
     → 선수 목록 + 요약 스탯 (count 기반 페이지네이션, 전체 선수)
  2) /player/{pid}/unique-tournament/16/season/{sid}/statistics/overall
     → 선수별 상세 스탯 + team 통째로
"""

import json
import os
import random
import time
from typing import Optional

from curl_cffi import requests as cf_requests

# ── 상수 ──────────────────────────────────────────────────────────────────────
BASE_URL = "https://api.sofascore.com/api/v1"
WORLD_CUP_TOURNAMENT_ID = 16
PAGE_SIZE = 100

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
SEASON_IDS_PATH = os.path.join(DATA_DIR, "season-ids.json")
OUTPUT_DIR = os.path.join(DATA_DIR, "players")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Origin": "https://www.sofascore.com",
    "Referer": "https://www.sofascore.com/",
    "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
}


# ── season-ids.json 로드 ──────────────────────────────────────────────────────
def load_season_ids() -> dict[int, int]:
    with open(SEASON_IDS_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return {int(year): sid for year, sid in raw["seasons"].items()}


# ── 유틸 ──────────────────────────────────────────────────────────────────────
def get(url: str, params: dict = None, retries: int = 3) -> Optional[dict]:
    for attempt in range(retries):
        try:
            res = cf_requests.get(
                url,
                impersonate="chrome124",
                headers=HEADERS,
                params=params,
                timeout=15,
            )
            if res.status_code == 200:
                return res.json()
            elif res.status_code == 403:
                wait = (2 ** attempt) * random.uniform(10, 20)
                print(f"  [403] {wait:.1f}초 대기 후 재시도 ({attempt + 1}/{retries})")
                time.sleep(wait)
            else:
                print(f"  [HTTP {res.status_code}] {url}")
                return None
        except Exception as e:
            print(f"  [ERROR] {url} → {e}")
            if attempt < retries - 1:
                time.sleep(random.uniform(5, 10))

    print(f"  [FAILED] {retries}회 재시도 후 실패: {url}")
    return None


def save_json(path: str, data: dict):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ── API 호출 ──────────────────────────────────────────────────────────────────
def fetch_season_players(season_id: int, offset: int = 0) -> Optional[dict]:
    """
    시즌 선수 목록 + 요약 스탯 (페이지 단위)
    GET /unique-tournament/{tid}/season/{sid}/statistics?limit=100&offset=N
    응답: { results: [...], count: 681 }
    """
    url = (
        f"{BASE_URL}/unique-tournament/{WORLD_CUP_TOURNAMENT_ID}"
        f"/season/{season_id}/statistics"
    )
    return get(url, params={"limit": PAGE_SIZE, "offset": offset})


def fetch_all_season_players(season_id: int) -> list:
    """count 기반으로 전체 페이지 순회, 선수 목록 전체 반환"""
    # 첫 페이지로 count 파악
    first = fetch_season_players(season_id, offset=0)
    if not first or not first.get("results"):
        return []

    total_pages = first.get("pages", 1)
    total = first.get("count", len(first["results"]))
    print(f"  총 {total}명 / {total_pages}페이지")

    all_results = list(first["results"])
    time.sleep(random.uniform(2.0, 4.0))

    for page in range(1, total_pages):
        offset = page * PAGE_SIZE
        data = fetch_season_players(season_id, offset=offset)
        if data and data.get("results"):
            all_results.extend(data["results"])
            print(f"  page {page+1}/{total_pages}: 누적 {len(all_results)}명")
        time.sleep(random.uniform(2.0, 4.0))

    return all_results


def fetch_player_detail(player_id: int, season_id: int) -> Optional[dict]:
    """
    선수 상세 스탯
    GET /player/{pid}/unique-tournament/{tid}/season/{sid}/statistics/overall
    응답: { statistics: { ...전체 스탯... }, team: { ...팀 정보... } }
    """
    url = (
        f"{BASE_URL}/player/{player_id}"
        f"/unique-tournament/{WORLD_CUP_TOURNAMENT_ID}"
        f"/season/{season_id}/statistics/overall"
    )
    return get(url)


# ── 시즌 수집 ─────────────────────────────────────────────────────────────────
def scrape_season(year: int, season_id: int) -> dict:
    print(f"\n{'='*50}")
    print(f"[{year}] season_id={season_id} 수집 시작")
    print(f"{'='*50}")

    # 1) 전체 선수 목록 수집 (페이지네이션)
    results = fetch_all_season_players(season_id)
    if not results:
        print("  ❌ 선수 목록 수집 실패")
        return {}

    print(f"  → 전체 {len(results)}명 수집 완료")

    players_index = {}

    # 2) 선수별 상세 스탯 수집
    for i, entry in enumerate(results):
        player = entry.get("player", {})
        player_id = player.get("id")
        player_name = player.get("name", "Unknown")

        if not player_id:
            continue

        players_index[str(player_id)] = player_name

        detail = fetch_player_detail(player_id, season_id)

        record = {
            "id": player_id,
            "name": player_name,
            "year": year,
            "season_id": season_id,
            "player_info": {
                "position": player.get("position"),
                "nationality": player.get("country", {}).get("name"),
                "nationality_code": player.get("country", {}).get("alpha2"),
                "date_of_birth": player.get("dateOfBirthTimestamp"),
            },
            "summary_statistics": entry.get("statistics"),
            "statistics": detail.get("statistics") if detail else None,
            "team": detail.get("team") if detail else None,
        }

        out_path = os.path.join(OUTPUT_DIR, str(year), f"{player_id}.json")
        save_json(out_path, record)
        print(f"  [{i+1}/{len(results)}] ✓ [{player_id}] {player_name}")

        time.sleep(random.uniform(1.5, 4.0))

    return players_index


def update_players_index(season_index: dict):
    index_path = os.path.join(DATA_DIR, "players-index.json")

    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            global_index = json.load(f)
    else:
        global_index = {}

    global_index.update(season_index)
    save_json(index_path, global_index)
    print(f"  → players-index.json 업데이트 완료 (누적 {len(global_index)}명)")


# ── 진입점 ────────────────────────────────────────────────────────────────────
def main(target_years: list[int] = None):
    all_seasons = load_season_ids()

    seasons = (
        {y: all_seasons[y] for y in target_years if y in all_seasons}
        if target_years
        else all_seasons
    )

    if not seasons:
        print("❌ 유효한 연도가 없습니다. season-ids.json을 확인하세요.")
        return

    for year, season_id in sorted(seasons.items()):
        season_index = scrape_season(year, season_id)
        update_players_index(season_index)

        wait = random.uniform(15.0, 30.0)
        print(f"\n  다음 시즌까지 {wait:.1f}초 대기...")
        time.sleep(wait)

    print("\n✅ 수집 완료")


if __name__ == "__main__":
    main(target_years=[2026])

    # 전체 수집:
    # main()
