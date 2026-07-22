"""
backend/data/players/total/ 폴더의 모든 JSON 파일을 읽어서
frontend/src/pages/players/playersData.ts 파일을 자동 생성하는 스크립트

- 이미 playersData.ts에 존재하는 선수는 기존 데이터 유지
- 존재하지 않는 선수는 position: 'N/A'로 새로 추가

사용법: backend/ 폴더에서 실행
  python scraper/generate_players_data.py
"""

import json
import re
from pathlib import Path

TOTAL_DIR   = Path(__file__).parent.parent / 'data' / 'players' / 'total'
OUTPUT_FILE = Path(__file__).parent.parent.parent / 'frontend' / 'src' / 'pages' / 'players' / 'playersData.ts'

# Sofascore nameCode → flagcdn 호환 코드 매핑
FLAG_CODE_MAP: dict[str, str] = {
    # ── 유럽 ──────────────────────────────────────────────────────────
    'POR': 'pt',      'ENG': 'gb-eng',  'SCO': 'gb-sct',  'WAL': 'gb-wls',
    'NIR': 'gb-nir',  'IRE': 'ie',      'IRL': 'ie',      'GER': 'de',
    'NED': 'nl',      'SUI': 'ch',      'DEN': 'dk',      'SWE': 'se',
    'NOR': 'no',      'GRE': 'gr',      'CRO': 'hr',      'SRB': 'rs',
    'SLO': 'si',      'SVK': 'sk',      'CZE': 'cz',      'ROU': 'ro',
    'HUN': 'hu',      'AUT': 'at',      'BEL': 'be',      'ESP': 'es',
    'ITA': 'it',      'FRA': 'fr',      'RUS': 'ru',      'FIN': 'fi',
    'POL': 'pl',      'UKR': 'ua',      'BUL': 'bg',      'BIH': 'ba',
    'MKD': 'mk',      'MNE': 'me',      'ALB': 'al',      'CYP': 'cy',
    'BLR': 'by',      'MDA': 'md',      'ISL': 'is',      'LTU': 'lt',
    'LVA': 'lv',      'EST': 'ee',      'GEO': 'ge',      'ARM': 'am',
    'AZE': 'az',
    # ── 남미 ──────────────────────────────────────────────────────────
    'CHI': 'cl',  'MEX': 'mx',  'ARG': 'ar',  'BRA': 'br',
    'COL': 'co',  'ECU': 'ec',  'URU': 'uy',  'PAR': 'py',
    'BOL': 'bo',  'PER': 'pe',  'VEN': 've',
    # ── 북중미 ────────────────────────────────────────────────────────
    'HON': 'hn',  'CRC': 'cr',  'PAN': 'pa',  'TRI': 'tt',
    'TTO': 'tt',  'JAM': 'jm',  'HAI': 'ht',  'CAN': 'ca',
    'USA': 'us',  'ESA': 'sv',  'CUB': 'cu',  'CUW': 'cw',
    'SUR': 'sr',  'GUY': 'gy',
    # ── 아프리카 ──────────────────────────────────────────────────────
    'MOR': 'ma',  'DZA': 'dz',  'TUN': 'tn',  'EGY': 'eg',
    'SEN': 'sn',  'CAM': 'cm',  'NIG': 'ng',  'GHA': 'gh',
    'CIV': 'ci',  'RSA': 'za',  'ZAF': 'za',  'ANG': 'ao',
    'TOG': 'tg',  'ZAI': 'cd',  'COD': 'cd',  'COG': 'cg',
    'GAB': 'ga',  'MLI': 'ml',  'GIN': 'gn',  'BFA': 'bf',
    'ETH': 'et',  'KEN': 'ke',  'MOZ': 'mz',  'ZAM': 'zm',
    'ZIM': 'zw',  'NAM': 'na',  'CPV': 'cv',
    # ── 아시아/중동 ───────────────────────────────────────────────────
    'KOR': 'kr',  'JPN': 'jp',  'JAP': 'jp',  'CHN': 'cn',
    'IRI': 'ir',  'KSA': 'sa',  'IRA': 'iq',
    'KUW': 'kw',  'UAE': 'ae',  'QAT': 'qa',  'ISR': 'il',
    'SYR': 'sy',  'JOR': 'jo',  'OMA': 'om',  'BHR': 'bh',
    'DPR': 'kp',  'KAZ': 'kz',  'UZB': 'uz',
    # ── 오세아니아 ────────────────────────────────────────────────────
    'AUS': 'au',  'NZL': 'nz',
    # ── 과거/소멸 국가 ────────────────────────────────────────────────
    'WGE': 'de',  'USS': 'ru',  'YUG': 'rs',
    'TCH': 'cz',  'DDR': 'de',  'SMO': 'rs',
}

def get_flag_code(name_code: str) -> str:
    upper = name_code.upper()
    return FLAG_CODE_MAP.get(upper, name_code.lower()[:2])

def parse_existing(ts_content: str) -> dict[int, dict]:
    existing = {}
    blocks = re.findall(r'\{([^{}]+)\}', ts_content, re.DOTALL)
    for block in blocks:
        id_match = re.search(r'id:\s*(\d+)', block)
        if not id_match:
            continue
        player_id = int(id_match.group(1))

        def get(key):
            m = re.search(rf"{key}:\s*'([^']*)'", block)
            if m: return m.group(1)
            m = re.search(rf'{key}:\s*"([^"]*)"', block)
            if m: return m.group(1)
            m = re.search(rf'{key}:\s*([0-9.]+)', block)
            if m: return m.group(1)
            return None

        seasons_m = re.search(r'seasons_played:\s*\[([^\]]*)\]', block)
        seasons = [int(x.strip()) for x in seasons_m.group(1).split(',') if x.strip()] if seasons_m else []

        existing[player_id] = {
            'id':                 player_id,
            'name':               get('name'),
            'nationality':        get('nationality'),
            'nationality_code':   get('nationality_code'),
            'team_code':          get('team_code') or '',
            'team_color_primary': get('team_color_primary'),
            'seasons_played':     seasons,
            'career_rating':      float(get('career_rating') or 0),
            'goals':              int(get('goals') or 0),
            'assists':            int(get('assists') or 0),
            'appearances':        int(get('appearances') or 0),
            'position':           get('position') or 'N/A',
        }
    return existing

def load_from_json(path: Path) -> dict | None:
    try:
        data   = json.loads(path.read_text(encoding='utf-8'))
        s      = data.get('statistics', {})
        team   = data.get('team', {})
        colors = team.get('teamColors', {})

        if not data.get('id') or not data.get('name'):
            return None

        name_code = team.get('nameCode') or ''

        return {
            'id':                 data['id'],
            'name':               data['name'],
            'nationality':        team.get('name', ''),
            'nationality_code':   get_flag_code(name_code),
            'team_code':          name_code.upper(),   # teams/*.webp 파일명용
            'team_color_primary': colors.get('primary', '#888888'),
            'seasons_played':     data.get('seasons_played', []),
            'career_rating':      round(data.get('career_rating') or 0, 3),
            'goals':              s.get('goals') or 0,
            'assists':            s.get('assists') or 0,
            'appearances':        s.get('appearances') or 0,
            'position':           'N/A',
        }
    except Exception as e:
        print(f'  오류: {path.name} — {e}')
        return None

def player_to_ts(p: dict) -> str:
    seasons = ', '.join(str(y) for y in p['seasons_played'])
    return (
        f"  {{\n"
        f"    id: {p['id']},\n"
        f"    name: {json.dumps(p['name'], ensure_ascii=False)},\n"
        f"    nationality: {json.dumps(p['nationality'], ensure_ascii=False)},\n"
        f"    nationality_code: '{p['nationality_code']}',\n"
        f"    team_code: '{p['team_code']}',\n"
        f"    team_color_primary: '{p['team_color_primary']}',\n"
        f"    seasons_played: [{seasons}],\n"
        f"    career_rating: {p['career_rating']},\n"
        f"    goals: {p['goals']},\n"
        f"    assists: {p['assists']},\n"
        f"    appearances: {p['appearances']},\n"
        f"    position: '{p['position']}',\n"
        f"  }},\n"
    )

def main():
    existing: dict[int, dict] = {}
    if OUTPUT_FILE.exists():
        existing = parse_existing(OUTPUT_FILE.read_text(encoding='utf-8'))
        print(f'기존 선수 수: {len(existing)}명')

    all_files = list(TOTAL_DIR.glob('*.json'))
    files = sorted(
        (f for f in all_files if f.stem.isdigit()),
        key=lambda p: int(p.stem),
    )
    skipped = [f.name for f in all_files if not f.stem.isdigit()]
    if skipped:
        print(f'선수 파일이 아니라 건너뜀: {skipped}')
    print(f'total/ 파일 수: {len(files)}')

    players = []
    new_count = 0

    for f in files:
        player_id = int(f.stem)
        if player_id in existing:
            # 기존 선수 — position만 수동 지정값 유지, 나머지는 JSON 최신값으로 갱신
            old = existing[player_id]
            raw = load_from_json(f)
            if raw:
                raw['position'] = old.get('position', 'N/A')
                players.append(raw)
            else:
                players.append(old)  # JSON 로드 실패 시에만 기존 값 폴백
        else:
            p = load_from_json(f)
            if p:
                players.append(p)
                new_count += 1

    print(f'유지: {len(existing)}명 / 신규 추가: {new_count}명 / 총: {len(players)}명')

    lines = [
        "import type { PlayerSummary } from './PlayerCard'\n",
        "\n",
        "// 이 파일은 scraper/generate_players_data.py로 자동 생성됩니다.\n",
        "// 포지션(position)은 수동으로 지정한 선수의 경우 유지됩니다.\n",
        "\n",
        "export const PLAYERS: PlayerSummary[] = [\n",
    ]
    for p in players:
        lines.append(player_to_ts(p))
    lines.append("]\n")

    OUTPUT_FILE.write_text(''.join(lines), encoding='utf-8')
    print(f'파일 저장 완료: {OUTPUT_FILE}')

if __name__ == '__main__':
    main()