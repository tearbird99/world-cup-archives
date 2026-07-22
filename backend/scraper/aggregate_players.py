"""
Player Career Stats Aggregator
- data/players/{year}/{player_id}.json 순회
- 선수별 전 시즌 스탯 합산
- 결과: data/players/total/{player_id}.json

제외 항목:
- year, season_id
- rating, totalRating, countRating
- expectedGoals, expectedAssists
- 키 이름에 "Percentage" 포함된 항목
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
PLAYERS_DIR = os.path.join(DATA_DIR, "players")
TOTAL_DIR = os.path.join(PLAYERS_DIR, "total")
INDEX_PATH = os.path.join(DATA_DIR, "players-index.json")

SEASON_YEARS = [1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026]

# 합산에서 제외할 키
EXCLUDE_KEYS = {
    "year", "season_id",
    "rating", "totalRating", "countRating",
    "expectedGoals", "expectedAssists",
    # statistics 메타 필드
    "id", "type", "statisticsType",
}


def is_excluded(key: str) -> bool:
    return key in EXCLUDE_KEYS or "Percentage" in key


def load_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: dict):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def aggregate():
    # players-index.json 로드
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        players_index = json.load(f)

    print(f"총 {len(players_index)}명 처리 시작\n")

    for player_id, player_name in players_index.items():
        seasons_data = []  # 이 선수의 시즌별 데이터 수집

        for year in SEASON_YEARS:
            path = os.path.join(PLAYERS_DIR, str(year), f"{player_id}.json")
            if not os.path.exists(path):
                continue
            data = load_json(path)
            seasons_data.append((year, data))

        if not seasons_data:
            continue

        # 기본 정보는 가장 최근 시즌에서 가져옴
        latest_year, latest_data = seasons_data[-1]
        player_info = latest_data.get("player_info", {})
        team = latest_data.get("team")

        # 합산
        summed = {}
        total_rating = 0.0
        count_rating = 0
        seasons_played = []

        for year, data in seasons_data:
            stats = data.get("statistics") or {}

            # rating 합산 (평균 계산용)
            total_rating += stats.get("totalRating", 0) or 0
            count_rating += stats.get("countRating", 0) or 0
            seasons_played.append(year)

            # 숫자형 스탯 합산
            for key, value in stats.items():
                if is_excluded(key):
                    continue
                if not isinstance(value, (int, float)):
                    continue
                summed[key] = summed.get(key, 0) + value

        # 커리어 평균 rating
        career_rating = round(total_rating / count_rating, 3) if count_rating > 0 else None

        record = {
            "id": int(player_id),
            "name": player_name,
            "player_info": player_info,
            "team": team,
            "seasons_played": seasons_played,
            "career_rating": career_rating,
            "totalRating": total_rating,
            "countRating": count_rating,
            "statistics": summed,
        }

        out_path = os.path.join(TOTAL_DIR, f"{player_id}.json")
        save_json(out_path, record)
        print(f"✓ [{player_id}] {player_name} ({len(seasons_played)}시즌)")

    print(f"\n✅ 완료 — data/players/total/ 에 저장됨")


if __name__ == "__main__":
    aggregate()
