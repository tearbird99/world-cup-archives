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
    'POR': 'pt',      # Portugal
    'ENG': 'gb-eng',  # England (축구 전용)
    'SCO': 'gb-sct',  # Scotland
    'WAL': 'gb-wls',  # Wales
    'NIR': 'gb-nir',  # Northern Ireland
    'IRE': 'ie',      # Ireland
    'GER': 'de',      # Germany (현재)
    'NED': 'nl',      # Netherlands
    'SUI': 'ch',      # Switzerland
    'DEN': 'dk',      # Denmark
    'SWE': 'se',      # Sweden
    'NOR': 'no',      # Norway
    'GRE': 'gr',      # Greece
    'CRO': 'hr',      # Croatia
    'SRB': 'rs',      # Serbia
    'SLO': 'si',      # Slovenia
    'SVK': 'sk',      # Slovakia
    'CZE': 'cz',      # Czech Republic
    'ROU': 'ro',      # Romania
    'HUN': 'hu',      # Hungary
    'AUT': 'at',      # Austria
    'BEL': 'be',      # Belgium
    'ESP': 'es',      # Spain
    'ITA': 'it',      # Italy
    'FRA': 'fr',      # France
    'RUS': 'ru',      # Russia
    'FIN': 'fi',      # Finland
    'POL': 'pl',      # Poland
    'UKR': 'ua',      # Ukraine
    'IRL': 'ie',      # Republic of Ireland
    'BUL': 'bg',      # Bulgaria
    'BIH': 'ba',      # Bosnia & Herzegovina
    'MKD': 'mk',      # North Macedonia
    'MNE': 'me',      # Montenegro
    'ALB': 'al',      # Albania
    'CYP': 'cy',      # Cyprus
    'BLR': 'by',      # Belarus
    'MDA': 'md',      # Moldova
    'ISL': 'is',      # Iceland
    'LTU': 'lt',      # Lithuania
    'LVA': 'lv',      # Latvia
    'EST': 'ee',      # Estonia
    'GEO': 'ge',      # Georgia
    'ARM': 'am',      # Armenia
    'AZE': 'az',      # Azerbaijan
    # ── 남미 ──────────────────────────────────────────────────────────
    'CHI': 'cl',      # Chile
    'MEX': 'mx',      # Mexico
    'ARG': 'ar',      # Argentina
    'BRA': 'br',      # Brazil
    'COL': 'co',      # Colombia
    'ECU': 'ec',      # Ecuador
    'URU': 'uy',      # Uruguay
    'PAR': 'py',      # Paraguay
    'BOL': 'bo',      # Bolivia
    'PER': 'pe',      # Peru
    'VEN': 've',      # Venezuela
    # ── 북중미 ────────────────────────────────────────────────────────
    'HON': 'hn',      # Honduras
    'CRC': 'cr',      # Costa Rica
    'PAN': 'pa',      # Panama
    'TRI': 'tt',      # Trinidad and Tobago
    'TTO': 'tt',      # Trinidad and Tobago (대체 코드)
    'JAM': 'jm',      # Jamaica
    'HAI': 'ht',      # Haiti
    'CAN': 'ca',      # Canada
    'USA': 'us',      # USA
    'ESA': 'sv',      # El Salvador
    'CUB': 'cu',      # Cuba
    'CUW': 'cw',      # Curaçao
    'SUR': 'sr',      # Suriname
    'GUY': 'gy',      # Guyana
    # ── 아프리카 ──────────────────────────────────────────────────────
    'MOR': 'ma',      # Morocco
    'ALG': 'dz',      # Algeria
    'TUN': 'tn',      # Tunisia
    'EGY': 'eg',      # Egypt
    'SEN': 'sn',      # Senegal
    'CAM': 'cm',      # Cameroon
    'NIG': 'ng',      # Nigeria
    'GHA': 'gh',      # Ghana
    'CIV': 'ci',      # Ivory Coast
    'RSA': 'za',      # South Africa
    'ZAF': 'za',      # South Africa (대체 코드)
    'ANG': 'ao',      # Angola
    'TOG': 'tg',      # Togo
    'ZAI': 'cd',      # Zaire → DR Congo
    'COD': 'cd',      # DR Congo
    'COG': 'cg',      # Congo
    'GAB': 'ga',      # Gabon
    'MLI': 'ml',      # Mali
    'GIN': 'gn',      # Guinea
    'BFA': 'bf',      # Burkina Faso
    'ETH': 'et',      # Ethiopia
    'KEN': 'ke',      # Kenya
    'MOZ': 'mz',      # Mozambique
    'ZAM': 'zm',      # Zambia
    'ZIM': 'zw',      # Zimbabwe
    'NAM': 'na',      # Namibia
    # ── 아시아/중동 ───────────────────────────────────────────────────
    'KOR': 'kr',      # South Korea
    'JPN': 'jp',      # Japan
    'JAP': 'jp',      # Japan (대체 코드)
    'CHN': 'cn',      # China
    'IRN': 'ir',      # Iran
    'SAU': 'sa',      # Saudi Arabia
    'KSA': 'sa',      # Saudi Arabia (대체 코드)
    'IRQ': 'iq',      # Iraq
    'KUW': 'kw',      # Kuwait
    'UAE': 'ae',      # UAE
    'QAT': 'qa',      # Qatar
    'ISR': 'il',      # Israel
    'SYR': 'sy',      # Syria
    'JOR': 'jo',      # Jordan
    'OMA': 'om',      # Oman
    'BHR': 'bh',      # Bahrain
    'DPR': 'kp',      # North Korea
    'KAZ': 'kz',      # Kazakhstan
    'UZB': 'uz',      # Uzbekistan
    # ── 오세아니아 ────────────────────────────────────────────────────
    'AUS': 'au',      # Australia
    'NZL': 'nz',      # New Zealand
    # ── 과거/소멸 국가 ────────────────────────────────────────────────
    'WGE': 'de',      # West Germany → Germany
    'USS': 'ru',      # Soviet Union → Russia
    'YUG': 'rs',      # Yugoslavia → Serbia
    'TCH': 'cz',      # Czechoslovakia → Czech Republic
    'DDR': 'de',      # East Germany → Germany
    'SMO': 'rs',      # Serbia & Montenegro → Serbia
}

def get_flag_code(name_code: str) -> str:
    upper = name_code.upper()
    if upper in FLAG_CODE_MAP:
        return FLAG_CODE_MAP[upper]
    # 매핑 없으면 소문자 2자리 폴백
    return name_code.lower()[:2]

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
        flag_code = get_flag_code(name_code)

        return {
            'id':                 data['id'],
            'name':               data['name'],
            'nationality':        team.get('name', ''),
            'nationality_code':   flag_code,
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

    files = sorted(TOTAL_DIR.glob('*.json'), key=lambda p: int(p.stem))
    print(f'total/ 파일 수: {len(files)}')

    players = []
    new_count = 0

    for f in files:
        player_id = int(f.stem)
        if player_id in existing:
            players.append(existing[player_id])
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