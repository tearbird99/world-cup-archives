"""
Player Season Stats Rankings
- data/players/{year}/ 순회 (1966, 1970, ... 폴더)
- 대회(연도)별 + 스탯 항목별 전체 선수 랭킹 생성 (TOP10으로 자르지 않음)
- rating만 대회 시기별 최소 출전 시간 기준 적용 (다른 스탯은 제한 없이 전체 포함)
    - 1966~1978: 320분 이상
    - 1982~     : 400분 이상
- 동률 시 minutesPlayed 적은 선수 우선
- 결과: 각 연도 폴더 안에 따로 저장 -> data/players/{year}/rankings.json
    형태: { "goals": [ {id, name, team, team_code, value}, ... ], "rating": [...], ... }
    (각 스탯 배열은 해당 연도 대회에서 그 스탯이 0이 아닌 선수 전체, 값 내림차순)
"""

import json
import os
from collections import defaultdict

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
PLAYERS_DIR = os.path.join(DATA_DIR, "players")
OUTPUT_FILENAME = "rankings.json"

EARLY_ERA_YEARS = {1966, 1970, 1974, 1978}
MIN_MINUTES_EARLY = 320
MIN_MINUTES_LATE = 400

# 리더보드에 포함할 스탯 항목 (이 목록에 없는 키는 랭킹 대상에서 제외)
STAT_KEYS = [
    "minutesPlayed",
    "rating",
    "goals",
    "assists",
    "leftFootGoals",
    "rightFootGoals",
    "headedGoals",
    "goalsFromOutsideTheBox",
    "freeKickGoal",
    "penaltyGoals",
    "bigChancesCreated",
    "bigChancesMissed",
    "totalShots",
    "shotsOnTarget",
    "touches",
    "keyPasses",
    "accuratePasses",
    "accurateOppositionHalfPasses",
    "accurateFinalThirdPasses",
    "accurateLongBalls",
    "accurateCrosses",
    "successfulDribbles",
    "groundDuelsWon",
    "aerialDuelsWon",
    "totalDuelsWon",
    "wasFouled",
    "tacklesWon",
    "interceptions",
    "clearances",
    "ballRecovery",
    "blockedShots",
    "fouls",
    "yellowCards",
    "redCards",
    "saves",
    "cleanSheet",
    "successfulRunsOut",
]


def load_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: dict):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_min_minutes_threshold(year: int) -> int:
    return MIN_MINUTES_EARLY if year in EARLY_ERA_YEARS else MIN_MINUTES_LATE


def build_rankings_by_season():
    year_dirs = sorted(
        d for d in os.listdir(PLAYERS_DIR)
        if os.path.isdir(os.path.join(PLAYERS_DIR, d)) and d != "total"
    )

    for year_dir in year_dirs:
        year_path = os.path.join(PLAYERS_DIR, year_dir)
        year = int(year_dir)
        min_minutes = get_min_minutes_threshold(year)

        stat_buckets = defaultdict(list)
        minutes_map = {}  # { player_id: minutesPlayed } — 동률 처리용

        files = [
            f for f in os.listdir(year_path)
            if f.endswith(".json") and f != OUTPUT_FILENAME
        ]
        print(f"[{year}] 총 {len(files)}명 처리 중... (rating 출전시간 기준: {min_minutes}분 이상)")

        for filename in files:
            path = os.path.join(year_path, filename)
            data = load_json(path)

            player_id = data.get("id")
            name = data.get("name", "Unknown")
            team = data.get("team") or {}
            team_name = team.get("name")
            team_code = team.get("nameCode")  # 예: "ENG" — frontend의 /teams/{CODE}.webp 와 매칭

            statistics = data.get("statistics") or {}
            minutes = statistics.get("minutesPlayed", 0) or 0
            minutes_map[player_id] = minutes

            entry_base = {
                "id": player_id,
                "name": name,
                "team": team_name,
                "team_code": team_code,
            }

            for key in STAT_KEYS:
                value = statistics.get(key)
                if not isinstance(value, (int, float)):
                    continue
                if value == 0:
                    continue

                # rating만 출전시간 기준 적용, 다른 스탯은 해당되는 선수 전부 포함
                if key == "rating" and minutes < min_minutes:
                    continue

                stat_buckets[key].append({**entry_base, "value": value})

            # 파생 스탯: goals + assists (데이터의 goalsAssistsSum 필드 그대로 사용)
            combined = statistics.get("goalsAssistsSum")
            if isinstance(combined, (int, float)) and combined:
                stat_buckets["goalsAssistsSum"].append({**entry_base, "value": combined})

        # 정렬 (TOP10으로 자르지 않고 해당되는 선수 전체 포함) + 동률 시 minutesPlayed 적은 순
        year_result = {}
        for stat, entries in stat_buckets.items():
            entries.sort(
                key=lambda e: (-e["value"], minutes_map.get(e["id"], float("inf")))
            )
            year_result[stat] = entries

        output_path = os.path.join(year_path, OUTPUT_FILENAME)
        save_json(output_path, year_result)
        print(f"  -> {output_path}")

    print("완료")


if __name__ == "__main__":
    build_rankings_by_season()