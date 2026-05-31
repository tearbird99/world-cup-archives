"""
Player Career Stats Rankings
- data/players/total/ 순회
- 모든 스탯 항목별 TOP 10 선수 랭킹 생성
- 동률 시 minutesPlayed 적은 순 (효율 우선)
- career_rating은 minutesPlayed 300분 이상인 선수만 포함
- 결과: data/players-rankings.json
"""

import json
import os
from collections import defaultdict

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
TOTAL_DIR = os.path.join(DATA_DIR, "players", "total")
OUTPUT_PATH = os.path.join(DATA_DIR, "players-rankings.json")

RATING_MIN_MINUTES = 630


def load_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: dict):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def build_rankings():
    stat_buckets = defaultdict(list)
    minutes_map = {}  # { player_id: minutesPlayed } — 동률 처리용

    files = [f for f in os.listdir(TOTAL_DIR) if f.endswith(".json")]
    print(f"총 {len(files)}명 처리 중...")

    for filename in files:
        path = os.path.join(TOTAL_DIR, filename)
        data = load_json(path)

        player_id = data.get("id")
        name = data.get("name", "Unknown")
        statistics = data.get("statistics", {})

        minutes = statistics.get("minutesPlayed", 0) or 0
        minutes_map[player_id] = minutes

        base_info = {
            "name": name,
        }

        # career_rating — 300분 이상만
        career_rating = data.get("career_rating")
        if career_rating is not None and minutes >= RATING_MIN_MINUTES:
            stat_buckets["career_rating"].append({
                **base_info,
                "value": career_rating,
            })

        # statistics 안 모든 항목
        for key, value in statistics.items():
            if not isinstance(value, (int, float)):
                continue
            if value == 0:
                continue
            stat_buckets[key].append({
                **base_info,
                "value": value,
            })

    # 각 스탯별 TOP 10 정렬
    # 동률이면 minutesPlayed 적은 순 (효율 우선)
    rankings = {}
    for stat_key, entries in stat_buckets.items():
        sorted_entries = sorted(
            entries,
            key=lambda x: (-x["value"], minutes_map.get(x.get("id"), 0))
        )
        top10 = sorted_entries[:10]

        rankings[stat_key] = [
            {
                "rank": i + 1,
                "name": e["name"],
                "value": e["value"],
            }
            for i, e in enumerate(top10)
        ]

    save_json(OUTPUT_PATH, rankings)
    print(f"✅ 완료 — {len(rankings)}개 스탯 항목 랭킹 생성")
    print(f"   저장 위치: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_rankings()
