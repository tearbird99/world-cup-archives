"""
Player All-Time Stats Rankings
- data/players/total/ 순회 (선수별 통합 누적 스탯 파일, 파일명 = player_id.json)
- 스탯 항목별 전체 선수 중 최대 500위까지 랭킹 생성
- rating은 career_rating(최상위 필드) 사용, 최소 출전 수(appearances) 7경기 이상만 포함
  (다른 스탯은 출전 제한 없이 0이 아닌 선수 전체 포함)
- 동률 시 minutesPlayed 적은 선수 우선 (시즌별 스크립트와 동일한 정책)
- 결과: data/players/total/rankings.json
    형태: { "goals": [ {id, name, team, team_code, value}, ... ], "rating": [...], ... }
"""

import json
import os
from collections import defaultdict

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
PLAYERS_DIR = os.path.join(DATA_DIR, "players")
TOTAL_DIR = os.path.join(PLAYERS_DIR, "total")
OUTPUT_FILENAME = "rankings.json"

MIN_APPEARANCES_FOR_RATING = 7
MAX_RANK = 500  # 올타임은 스탯별 최대 500위까지만 저장

# 리더보드에 포함할 스탯 항목 (rating은 career_rating으로 별도 처리하므로 여기엔 없음)
STAT_KEYS = [
    "minutesPlayed",
    "goals",
    "leftFootGoals",
    "rightFootGoals",
    "headedGoals",
    "goalsFromOutsideTheBox",
    "freeKickGoal",
    "penaltyGoals",
    "bigChancesMissed",
    "totalShots",
    "shotsOnTarget",
    "assists",
    "keyPasses",
    "bigChancesCreated",
    "accuratePasses",
    "accurateOppositionHalfPasses",
    "accurateFinalThirdPasses",
    "accurateLongBalls",
    "accurateCrosses",
    "tacklesWon",
    "interceptions",
    "clearances",
    "ballRecovery",
    "blockedShots",
    "yellowCards",
    "redCards",
    "saves",
    "cleanSheet",
    "successfulRunsOut",
    "touches",
    "successfulDribbles",
    "groundDuelsWon",
    "aerialDuelsWon",
    "totalDuelsWon",
    "wasFouled",
    "fouls",
]


def load_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: dict):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def build_all_time_rankings():
    stat_buckets = defaultdict(list)
    minutes_map = {}  # { player_id: minutesPlayed } — 동률 처리용

    files = [
        f for f in os.listdir(TOTAL_DIR)
        if f.endswith(".json") and f != OUTPUT_FILENAME
    ]
    print(f"[all-time] 총 {len(files)}명 처리 중... (rating 기준: {MIN_APPEARANCES_FOR_RATING}경기 이상)")

    for filename in files:
        path = os.path.join(TOTAL_DIR, filename)
        data = load_json(path)

        player_id = data.get("id")
        name = data.get("name", "Unknown")
        team = data.get("team") or {}
        team_name = team.get("name")
        team_code = team.get("nameCode")

        statistics = data.get("statistics") or {}
        minutes = statistics.get("minutesPlayed", 0) or 0
        appearances = statistics.get("appearances", 0) or 0
        minutes_map[player_id] = minutes

        entry_base = {
            "id": player_id,
            "name": name,
            "team": team_name,
            "team_code": team_code,
        }

        # 일반 스탯 (화이트리스트, 출전 제한 없음)
        for key in STAT_KEYS:
            value = statistics.get(key)
            if not isinstance(value, (int, float)):
                continue
            if value == 0:
                continue
            stat_buckets[key].append({**entry_base, "value": value})

        # 파생 스탯: goals + assists (데이터의 goalsAssistsSum 필드 그대로 사용)
        combined = statistics.get("goalsAssistsSum")
        if isinstance(combined, (int, float)) and combined:
            stat_buckets["goalsAssistsSum"].append({**entry_base, "value": combined})

        # rating: career_rating(최상위 필드) + 최소 출전 수 기준
        career_rating = data.get("career_rating")
        if isinstance(career_rating, (int, float)) and appearances >= MIN_APPEARANCES_FOR_RATING:
            stat_buckets["rating"].append({**entry_base, "value": career_rating})

    # 정렬 + 스탯별 최대 500위까지만 저장 + 동률 시 minutesPlayed 적은 순
    result = {}
    for stat, entries in stat_buckets.items():
        entries.sort(
            key=lambda e: (-e["value"], minutes_map.get(e["id"], float("inf")))
        )
        result[stat] = entries[:MAX_RANK]

    output_path = os.path.join(TOTAL_DIR, OUTPUT_FILENAME)
    save_json(output_path, result)
    print(f"완료: {output_path}")


if __name__ == "__main__":
    build_all_time_rankings()