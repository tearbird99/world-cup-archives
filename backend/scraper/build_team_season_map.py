"""
Sofascore World Cup Standings -> team_ids 추출 스크립트

목적:
  team-season-map.json 에 특정 연도 항목이 없을 때(또는 새로 추가할 때),
  standings API에서 조별리그 참가팀 전체의 team_id를 뽑아서 항목을 채운다.

엔드포인트:
  GET /unique-tournament/16/season/{sid}/standings/total
  응답 예상 구조:
    { "standings": [ { "name": "Group A", "rows": [ { "team": {"id": ...} }, ... ] }, ... ] }

사용법: backend/ 폴더에서 실행
  python scraper/build_team_season_map.py 2026 58210

결과:
  data/team-season-map.json 에 "2026" 키를 추가/갱신 (기존 다른 연도 항목은 보존)
"""

import json
import random
import sys
import time
from pathlib import Path

from curl_cffi import requests as cf_requests

BASE_URL = "https://api.sofascore.com/api/v1"
WORLD_CUP_TOURNAMENT_ID = 16

DATA_DIR = Path(__file__).parent.parent / "data"
TEAM_SEASON_MAP_PATH = DATA_DIR / "team-season-map.json"

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


def get(url: str, params: dict = None, retries: int = 3):
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


def fetch_standings(season_id: int):
    url = f"{BASE_URL}/unique-tournament/{WORLD_CUP_TOURNAMENT_ID}/season/{season_id}/standings/total"
    return get(url)


def extract_team_ids(standings_data: dict) -> list[int]:
    """
    standings 응답에서 team.id 전체를 그룹 순서 -> 그룹 내 순위 순서대로 수집.
    그룹이 없는(단일 리그 형태) 응답 구조도 대비해서 rows가 최상위에 바로 오는 경우도 처리.
    """
    if not standings_data:
        return []

    groups = standings_data.get("standings")
    if not groups:
        # 혹시 최상위에 바로 rows가 오는 변형 구조 대비
        groups = [standings_data] if standings_data.get("rows") else []

    team_ids = []
    seen = set()

    for group in groups:
        group_name = group.get("name", "?")
        rows = group.get("rows", [])
        print(f"  {group_name}: {len(rows)}팀")
        for row in rows:
            team = row.get("team", {})
            tid = team.get("id")
            tname = team.get("name", "?")
            if tid is None:
                continue
            if tid in seen:
                print(f"    ⚠ 중복 team_id 발견, 스킵: {tid} ({tname})")
                continue
            seen.add(tid)
            team_ids.append(tid)
            print(f"    - {tid}: {tname}")

    return team_ids


def load_map() -> dict:
    if TEAM_SEASON_MAP_PATH.exists():
        return json.loads(TEAM_SEASON_MAP_PATH.read_text(encoding="utf-8"))
    return {}


def save_map(data: dict):
    TEAM_SEASON_MAP_PATH.parent.mkdir(parents=True, exist_ok=True)
    TEAM_SEASON_MAP_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def main():
    if len(sys.argv) != 3:
        print("사용법: python build_team_season_map.py <year> <season_id>")
        print("예시:   python build_team_season_map.py 2026 58210")
        sys.exit(1)

    year = sys.argv[1]
    season_id = int(sys.argv[2])

    print(f"[{year}] season_id={season_id} standings 조회 중...")
    data = fetch_standings(season_id)

    if not data:
        print("❌ standings 조회 실패 (응답 없음). season_id가 유효한지, "
              "혹은 아직 대회 데이터가 Sofascore에 반영됐는지 확인하세요.")
        sys.exit(1)

    team_ids = extract_team_ids(data)

    if not team_ids:
        print("❌ team_id를 하나도 못 뽑았습니다. 응답 구조가 예상과 다를 수 있습니다.")
        print("아래는 응답의 최상위 키들입니다 — 구조 확인용:")
        print(list(data.keys()))
        sys.exit(1)

    print(f"\n총 {len(team_ids)}개 team_id 추출 완료")

    team_season_map = load_map()

    if year in team_season_map:
        existing_count = len(team_season_map[year].get("team_ids", []))
        print(f"⚠ 기존에 '{year}' 항목이 이미 있습니다 (team_ids {existing_count}개). 덮어씁니다.")

    team_season_map[year] = {
        "season_id": season_id,
        "team_ids": team_ids,
    }

    # 연도순 정렬해서 저장 (가독성 목적)
    sorted_map = {k: team_season_map[k] for k in sorted(team_season_map.keys(), key=int)}
    save_map(sorted_map)

    print(f"✅ team-season-map.json 에 '{year}' 항목 저장 완료 ({TEAM_SEASON_MAP_PATH})")


if __name__ == "__main__":
    main()