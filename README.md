# World Cup Archives

**1966년부터 2022년까지** 모든 FIFA 월드컵 대회를 아우르는 종합 통계 아카이브입니다. 선수 프로필, 팀별 역사, 스탯 순위까지 — 데이터 수집부터 직접 구축했습니다.

🔗 **라이브 데모:** https://world-cup-archives.onrender.com

> 백엔드는 무료 인스턴스로 운영되어 일정 시간 비활성화 시 슬립 상태로 전환됩니다. 첫 요청 시 30~60초 정도 지연될 수 있습니다.

## 스크린샷

| 홈 | 선수 목록 |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Players](docs/screenshots/players.png) |

| 선수 상세 | 팀 |
|---|---|
| ![Player Detail](docs/screenshots/player-detail.png) | ![Teams](docs/screenshots/teams.png) |

| 스탯 리더보드 |
|---|
| ![Stats](docs/screenshots/stats.png) |

## 기술 스택

**프론트엔드**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- i18next (영어 / 한국어)
- Recharts (선수 스탯 레이더 차트)
- shadcn/ui + Radix UI

**백엔드**
- FastAPI (Python)
- JSON 파일 기반 데이터 저장 (별도 DB 없이, 자체 스크래핑 파이프라인으로 생성)

**데이터 파이프라인**
- Playwright 기반 Python 스크래퍼로 15개 대회의 선수·팀·스탯 데이터를 수집 및 정규화

**배포**
- Render (프론트엔드는 Static Site, FastAPI 백엔드는 Web Service)

## 주요 기능

**완료된 기능**
- 🏠 대회 개요를 보여주는 홈페이지
- 👤 선수 목록 — 페이지네이션, 발음 구별 기호 무시 검색, 커리어·대회별 스탯과 레이더 차트가 포함된 상세 페이지
- 🏳️ 팀 목록 — 연도별 대회 출전 기록과 스탯이 담긴 상세 페이지
- 📊 스탯 리더보드 — 연도별/통산 다양한 스탯 카테고리 순위, 스탯별 상세 페이지
- 🌓 라이트/다크 테마
- 🌐 영어·한국어 완전 지원

**향후 추가될 기능**
- 🏆 Records 페이지
- 📜 History 페이지
- 🎮 Games & Quiz 섹션
- 팀 단위 랭킹 및 포지션 기반 필터링

## 프로젝트 구조
```
world-cup-archives/
├── backend/
│   ├── main.py                      # FastAPI 앱 — players/teams/stats 라우트 정의
│   ├── requirements.txt
│   ├── data/                         # 생성된 정적 데이터 (커밋됨, API가 런타임에 읽기만 함)
│   │   ├── players/
│   │   │   ├── {year}/               # 대회별 선수 시즌 스탯 (1966~2022)
│   │   │   │   ├── {player_id}.json
│   │   │   │   └── rankings.json     # 해당 대회 스탯 순위
│   │   │   └── total/                # 선수별 통산 스탯 + all-time 순위
│   │   ├── teams/
│   │   │   └── {year}/{team_slug}.json
│   │   ├── team-slug-map.json        # sofascore team_id → slug 매핑
│   │   ├── team-season-map.json
│   │   └── season-ids.json
│   └── scraper/                      # 스크래퍼 파일들
│       ├── player_scraper.py         # Playwright로 선수 원본 데이터 수집
│       ├── team_scraper.py           # Playwright로 팀 원본 데이터 수집
│       ├── aggregate_players.py      # 선수 데이터 집계
│       ├── build_player_rankings_by_season.py   # 대회별 스탯 순위 생성
│       ├── build_player_rankings_all_time.py    # 통산 스탯 순위 생성
│       ├── build_rankings.py
│       └── generate_players_data.py  # 프론트엔드용 playersData.ts 생성
│
└── frontend/
    └── src/
        ├── App.tsx                   # 라우트 정의
        ├── main.tsx
        ├── pages/
        │   ├── home/                  # 홈 (대회 개요, 슬라이드쇼)
        │   ├── players/               # 선수 목록 + 상세
        │   │   ├── Players.tsx        # 페이지네이션, 검색
        │   │   ├── PlayerDetail.tsx   # 커리어/대회별 스탯, 레이더 차트
        │   │   ├── PlayerCard.tsx
        │   │   ├── playersData.ts     # generate_players_data.py로 생성된 목록 데이터
        │   │   ├── components/        # BigStat, RadarGroup, StatTable, ModeToggle
        │   │   └── hooks/usePlayerStats.ts
        │   ├── teams/                 # 팀 목록 + 상세 (players와 동일한 구조)
        │   ├── stats/                 # 스탯 리더보드
        │   │   ├── Stats.tsx          # 연도 선택, 카테고리별 스탯 카드
        │   │   ├── StatsDetail.tsx    # 스탯별 전체 순위 페이지네이션
        │   │   ├── components/StatCard.tsx, PlayerAvatar.tsx
        │   │   └── hooks/usePlayerSeasonRankings.ts
        │   ├── records/               # 준비 중
        │   ├── history/               # 준비 중
        │   └── games/                 # 준비 중 (퀴즈 더미데이터)
        ├── components/
        │   ├── layout/                # Header, Sidebar, Footer, Layout
        │   └── ui/                    # shadcn/ui 기반 공용 컴포넌트
        ├── contexts/                  # ThemeContext, SidebarContext
        ├── locales/{en,ko}/           # i18next 번역 리소스
        └── lib/                       # i18n.ts, utils.ts
```

## 로컬 실행 방법

### 백엔드

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

`http://localhost:8000`에서 API 실행. `/docs`에서 인터랙티브 문서 확인 가능합니다.

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

dev 서버는 `/api` 요청을 `http://127.0.0.1:8000`으로 프록시하므로, 백엔드를 먼저 실행해둬야 합니다.

## 데이터 출처

선수·팀 데이터는 공개된 경기 통계를 자체 Python 파이프라인(`backend/scraper/`)으로 스크래핑·가공하여 정적 JSON으로 저장하고, API가 런타임에 이를 읽어서 서빙합니다.