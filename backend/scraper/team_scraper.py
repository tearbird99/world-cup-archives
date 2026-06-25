"""
실제 팀 페이지를 열고, (필요시 대회 드롭다운을 FIFA World Cup으로 전환 →) Statistics 탭 →
연도 드롭다운을 자동으로 클릭해서 원하는 연도의 statistics/overall 응답을
page.on("response")로 캡처한다.

이 방식이 동작하는 이유:
  - API URL에 직접 page.goto() → Cloudflare 403 (확인됨)
  - 실제 팀 페이지를 열고 UI를 클릭해서 발생하는 내부 요청 → 200 (확인됨)

흐름 (팀 1개당):
  1) https://www.sofascore.com/football/team/{slug}/{team_id} 접속
     (슬러그를 모르면 team_id만으로 접속해도 사이트가 올바른 슬러그로 리다이렉트함 → 그 슬러그를 캐싱)
  2) "Statistics" 탭 클릭
  3) 대회 드롭다운이 'FIFA World Cup'이 아니면 클릭해서 전환
     (일부 팀은 가장 최근 시즌이 월드컵이 아닌 예선전이라 기본값이 다르게 뜸)
  4) 연도 드롭다운 버튼 클릭 → 목록 펼침
  5) 목표 연도 텍스트 클릭
  6) response 캡처 대기 → 저장

사용법: backend/ 폴더에서 실행
  python scraper/team_scraper.py

결과: data/teams/{year}/{slug}.json  (예: data/teams/1966/brazil.json)
슬러그 매핑은 data/team-slug-map.json에 캐싱되어 재실행 시 재사용됨.
"""

import json
import random
import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

DATA_DIR = Path(__file__).parent.parent / "data"
TEAM_SEASON_MAP_PATH = DATA_DIR / "team-season-map.json"
TEAM_SLUG_MAP_PATH = DATA_DIR / "team-slug-map.json"  # team_id(str) -> slug, 없으면 "team"으로 시도
OUTPUT_DIR = DATA_DIR / "teams"

TOURNAMENT_ID = 16
OVERALL_PATTERN = re.compile(
    rf"/team/(\d+)/unique-tournament/{TOURNAMENT_ID}/season/(\d+)/statistics/overall"
)


def save_json(path: Path, data: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def extract_slug_from_url(url: str) -> str | None:
    """https://www.sofascore.com/football/team/{slug}/{team_id}... 에서 slug 추출"""
    m = re.search(r"/football/team/([a-z0-9-]+)/\d+", url)
    return m.group(1) if m else None


STATS_SCOPE_SELECTOR = "#tabpanel-statistics, [id^='tabpanel-statistics']"


def get_stats_scope(page):
    """
    Statistics 탭 패널로 스코프를 좁힌 locator.
    이 안에서만 드롭다운을 찾아야 Matches 위젯의 'All' 필터나
    매치 리스트의 대회명 링크를 잘못 클릭하는 사고를 막을 수 있다.
    """
    scope = page.locator(STATS_SCOPE_SELECTOR).first
    try:
        if scope.count() > 0:
            return scope
    except Exception:
        pass
    return page  # 못 찾으면 폴백(이전 동작과 동일하지만 위험을 알리는 로그를 호출부에서 남김)


def select_tournament_world_cup(page) -> bool:
    """
    Statistics 탭 안의 첫 번째(대회) 드롭다운이 'FIFA World Cup'이 아니면 클릭해서 전환한다.
    이미 FIFA World Cup이면 아무것도 하지 않고 True를 반환.
    """
    try:
        scope = get_stats_scope(page)
        if scope is page:
            print("    [디버그] Statistics 탭 패널을 찾을 수 없어 전역 검색으로 폴백 — 위험: 다른 위젯의 드롭다운을 잘못 클릭할 수 있음")

        buttons = scope.locator("button.dropdown__button")
        count = buttons.count()
        if count == 0:
            print("    [디버그] Statistics 영역 안에서 대회 드롭다운 버튼을 찾을 수 없음")
            return False

        tournament_button = buttons.nth(0)
        current_text = tournament_button.inner_text().strip()
        print(f"    [디버그] 현재 대회 드롭다운(Statistics 스코프): '{current_text}'")

        if current_text == "FIFA World Cup":
            return True

        tournament_button.click(timeout=5000)
        time.sleep(1.0)

        # 드롭다운 옵션은 패널 밖 포털에 렌더링될 수 있으므로 aria-controls로
        # 정확히 "이 버튼이 연 리스트"만 페이지 전역에서 찾는다 (텍스트 전역
        # 검색과 달리 Matches 리스트의 대회명 링크 등을 잘못 클릭할 위험이 없다)
        option = None
        list_id = None
        try:
            list_id = tournament_button.get_attribute("aria-controls")
        except Exception:
            pass

        if list_id:
            option_list = page.locator(f"[id='{list_id}']")
            option = option_list.get_by_text("FIFA World Cup", exact=True)
            opt_count = option.count()
            print(f"    [디버그] aria-controls({list_id}) 안 'FIFA World Cup' 매치 개수: {opt_count}")
        else:
            opt_count = 0
            print("    [디버그] tournament_button의 aria-controls 속성을 찾을 수 없음")

        # 폴백: Statistics 스코프 내부 텍스트 검색 (이전 동작 유지)
        if opt_count == 0:
            option = scope.locator("text='FIFA World Cup'")
            opt_count = option.count()
            print(f"    [디버그] 폴백: Statistics 스코프 내 'FIFA World Cup' 매치 개수: {opt_count}")

        if opt_count == 0:
            print("    [디버그] 'FIFA World Cup' 옵션을 대회 드롭다운에서 찾을 수 없음")
            try:
                page.keyboard.press("Escape")
            except Exception:
                pass
            return False

        target = option.first
        target.scroll_into_view_if_needed(timeout=3000)
        time.sleep(0.3)
        try:
            target.click(timeout=5000)
        except Exception as click_err:
            # 광고 iframe 등이 위에 겹쳐서 일반 클릭이 막히는 경우가 있다.
            # force=True는 실제 클릭 가능 여부 검사를 건너뛰고 이벤트를 바로 발생시킨다.
            print(f"    [디버그] 일반 클릭 실패({click_err.__class__.__name__}), force 클릭으로 재시도")
            target.click(timeout=5000, force=True)
        time.sleep(1.0)

        # 전환 후 다시 확인 (스코프 재조회 — 드롭다운 전환으로 DOM이 재렌더링됐을 수 있음)
        scope = get_stats_scope(page)
        buttons = scope.locator("button.dropdown__button")
        new_text = buttons.nth(0).inner_text().strip()
        print(f"    [디버그] 대회 드롭다운 전환 후: '{new_text}'")
        return new_text == "FIFA World Cup"

    except Exception as e:
        print(f"    대회 드롭다운 전환 실패: {e}")
        return False


def select_year(page, year: str) -> bool:
    """연도 드롭다운을 열고 목표 연도를 클릭. 성공하면 True."""
    try:
        scope = get_stats_scope(page)
        if scope is page:
            print("    [디버그] Statistics 탭 패널을 찾을 수 없어 전역 검색으로 폴백 — 위험: 매치 리스트의 다른 텍스트를 잘못 클릭할 수 있음")

        buttons = scope.locator("button.dropdown__button")
        count = buttons.count()

        year_idx = None
        for i in range(count):
            try:
                txt = buttons.nth(i).inner_text().strip()
            except Exception:
                continue
            if txt == "FIFA World Cup":
                year_idx = i + 1
                break

        if year_idx is None or year_idx >= count:
            print(f"    [디버그] 연도 드롭다운을 찾을 수 없음 (count={count}) — 이 팀/연도엔 통계 데이터가 없을 수 있음")
            return False

        year_button = buttons.nth(year_idx)
        current_text = year_button.inner_text()
        print(f"    [디버그] 현재 연도 버튼 텍스트: '{current_text}', 목표: '{year}'")

        if current_text.strip() == year:
            print(f"    [디버그] 이미 목표 연도가 선택되어 있음 — 클릭 스킵")
            return True

        year_button.click(timeout=5000)
        time.sleep(1.5)

        # 펼쳐진 드롭다운의 HTML 구조를 파일로 저장 (최초 1회만, 디버깅용)
        debug_html_path = Path(__file__).parent / "debug_dropdown.html"
        if not debug_html_path.exists():
            try:
                html = page.content()
                debug_html_path.write_text(html, encoding="utf-8")
                print(f"    [디버그] 전체 페이지 HTML을 {debug_html_path}에 저장함")
            except Exception:
                pass

        # 드롭다운 옵션 목록은 패널 안이 아니라 포털(body 최상단)에 별도로 렌더링되는
        # 경우가 많다. aria-controls가 펼쳐진 리스트의 id를 가리키므로,
        # 이를 이용해 정확히 "이 버튼이 연 리스트"만 페이지 전역에서 찾는다.
        # (텍스트 전역 검색과 달리 다른 위젯을 잘못 클릭할 위험이 없다)
        option = None
        list_id = None
        try:
            list_id = year_button.get_attribute("aria-controls")
        except Exception:
            pass

        if list_id:
            # id에 React useId가 생성하는 특수문자(« »)가 포함될 수 있어 #id 대신
            # 속성 선택자를 사용 (CSS 선택자에서 #id 표기는 특수문자에 취약함)
            option_list = page.locator(f"[id='{list_id}']")
            option = option_list.get_by_text(year, exact=True)
            opt_count = option.count()
            print(f"    [디버그] aria-controls({list_id}) 안 '{year}' 매치 개수: {opt_count}")
        else:
            opt_count = 0
            print("    [디버그] year_button의 aria-controls 속성을 찾을 수 없음")

        # aria-controls 방식이 실패하면 Statistics 스코프 내부로 폴백 (이전 동작 유지)
        if opt_count == 0:
            option = scope.locator(f"text='{year}'")
            opt_count = option.count()
            print(f"    [디버그] 폴백: Statistics 스코프 내 '{year}' 매치 개수: {opt_count}")

        if opt_count == 0:
            print(f"    [디버그] 목표 연도 '{year}'를 찾을 수 없음")
            try:
                page.keyboard.press("Escape")
            except Exception:
                pass
            return False

        # 매치된 모든 요소의 bounding box 출력 (어떤 게 드롭다운 옵션인지 식별용)
        for i in range(opt_count):
            try:
                box = option.nth(i).bounding_box()
                tag = option.nth(i).evaluate("el => el.tagName + '.' + el.className")
                print(f"      [{i}] box={box} tag={tag}")
            except Exception as e:
                print(f"      [{i}] 정보 읽기 실패: {e}")

        target = option.first
        target.scroll_into_view_if_needed(timeout=3000)
        time.sleep(0.5)
        try:
            target.click(timeout=5000)
        except Exception as click_err:
            # 광고 iframe 등이 위에 겹쳐서 일반 클릭이 막히는 경우가 있다.
            print(f"    [디버그] 일반 클릭 실패({click_err.__class__.__name__}), force 클릭으로 재시도")
            target.click(timeout=5000, force=True)
        time.sleep(1)

        try:
            page.screenshot(path="debug_after_click.png")
        except Exception:
            pass

        return True
    except Exception as e:
        print(f"    연도 선택 실패({year}): {e}")
        return False


def main():
    if not TEAM_SEASON_MAP_PATH.exists():
        print("team-season-map.json이 없습니다. 먼저 build_team_season_map.py를 실행하세요.")
        return

    team_season_map = json.loads(TEAM_SEASON_MAP_PATH.read_text(encoding="utf-8"))

    team_slug_map = {}
    if TEAM_SLUG_MAP_PATH.exists():
        team_slug_map = json.loads(TEAM_SLUG_MAP_PATH.read_text(encoding="utf-8"))

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="en-US",
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        captured = {}

        def handle_response(response):
            m = OVERALL_PATTERN.search(response.url)
            if m and response.status == 200:
                team_id = int(m.group(1))
                season_id = int(m.group(2))
                try:
                    captured[(team_id, season_id)] = response.json()
                except Exception:
                    pass

        page.on("response", handle_response)

        success = 0
        fail = 0
        consecutive_failures = 0
        COOLDOWN_THRESHOLD = 3       # 연속 실패 이 횟수 넘으면 쿨다운
        COOLDOWN_SECONDS = 90        # 쿨다운 시간

        # 이번 재실행 범위: 1998~2022 (이전 실행에서 1966~1998 일부까지는 이미 완료됨)
        YEAR_RANGE_START = 1998
        YEAR_RANGE_END = 2022

        for year, info in sorted(team_season_map.items(), key=lambda x: int(x[0])):
            if not (YEAR_RANGE_START <= int(year) <= YEAR_RANGE_END):
                continue

            season_id = info["season_id"]
            team_ids = info["team_ids"]

            year_dir = OUTPUT_DIR / year

            for team_id in team_ids:
                cached_slug = team_slug_map.get(str(team_id))
                fallback_slug = cached_slug or str(team_id)
                out_path = year_dir / f"{fallback_slug}.json"
                if out_path.exists():
                    print(f"  [{year}] {fallback_slug} 이미 있음, 스킵")
                    continue

                # 슬러그를 모르면 더미로 접속해도 sofascore가 올바른 슬러그로 리다이렉트함
                team_url = f"https://www.sofascore.com/football/team/{fallback_slug}/{team_id}#tab:statistics"

                key = (team_id, season_id)
                captured.pop(key, None)

                attempt_ok = False
                last_error = None
                slug = fallback_slug

                # 네트워크 오류(타임아웃/커넥션리셋)는 최대 2번까지 시도
                for attempt in range(2):
                    try:
                        page.goto(team_url, wait_until="domcontentloaded", timeout=30000)
                        time.sleep(2)

                        # 리다이렉트된 실제 URL에서 슬러그 추출 → 매핑 캐싱 + 파일명 갱신
                        real_slug = extract_slug_from_url(page.url)
                        if real_slug and real_slug != slug:
                            slug = real_slug
                            team_slug_map[str(team_id)] = slug
                            out_path = year_dir / f"{slug}.json"
                            if out_path.exists():
                                print(f"  [{year}] {slug} 이미 있음(슬러그 확인 후), 스킵")
                                attempt_ok = True
                                break

                        try:
                            page.get_by_role("tab", name="Statistics", exact=True).click(timeout=5000)
                        except Exception:
                            # role 매칭 실패 시 탭 버튼 텍스트로 폴백 (data-testid 우선 시도)
                            try:
                                page.click("button[data-testid='tab-statistics']", timeout=5000)
                            except Exception:
                                pass
                        time.sleep(1.5)

                        # Statistics 패널이 실제로 떠 있는지 확인 — 아니면 잘못된 화면에서
                        # 드롭다운을 조작해 매치 상세 페이지 등으로 튕겨나갈 위험이 있다.
                        scope_check = get_stats_scope(page)
                        if scope_check is page:
                            print("    [디버그] Statistics 탭 패널이 보이지 않음 — 클릭이 실패했을 수 있음, 이번 시도는 캡처 실패로 처리")
                            attempt_ok = True  # goto 자체는 성공이므로 재시도 루프는 종료
                            break

                        # 대회 드롭다운이 FIFA World Cup이 아니면 먼저 전환
                        if key not in captured:
                            tournament_ok = select_tournament_world_cup(page)
                            print(f"    [디버그] 대회 전환 결과: {tournament_ok}")
                            if not tournament_ok:
                                print(f"    [디버그] FIFA World Cup 대회를 찾을 수 없음 — 이 팀은 월드컵 통계가 없을 수 있음")

                        # 이미 기본값으로 원하는 연도가 캡처돼 있으면 드롭다운 조작 불필요
                        if key not in captured:
                            ok = select_year(page, year)
                            print(f"    [디버그] select_year 결과: {ok}, 현재 captured 키들: {list(captured.keys())[-3:]}")

                        waited = 0
                        while key not in captured and waited < 15:
                            time.sleep(1)
                            waited += 1
                        print(f"    [디버그] 대기 종료, waited={waited}s, key in captured: {key in captured}, 전체 captured 크기: {len(captured)}")

                        attempt_ok = True
                        break  # goto/click 자체는 성공했으니 재시도 루프 탈출 (캡처 실패는 별도 처리)

                    except Exception as e:
                        last_error = e
                        msg = str(e)
                        is_network_error = (
                            "Timeout" in msg or "ERR_CONNECTION" in msg or "net::" in msg
                        )
                        if is_network_error and attempt == 0:
                            print(f"  [{year}] {slug} 네트워크 오류, 잠시 대기 후 1회 재시도: {e}")
                            time.sleep(random.uniform(8.0, 12.0))
                            continue
                        else:
                            break

                if out_path.exists():
                    # 슬러그 확인 후 이미 존재하던 케이스 — 스킵으로 처리, 카운트 변화 없음
                    pass
                elif not attempt_ok:
                    print(f"  [{year}] {slug} ✗ 오류: {last_error}")
                    fail += 1
                    consecutive_failures += 1
                elif key in captured:
                    save_json(out_path, captured[key])
                    print(f"  [{year}] {slug} ✓ 저장 완료")
                    success += 1
                    consecutive_failures = 0
                else:
                    print(f"  [{year}] {slug} ✗ 캡처 실패")
                    fail += 1
                    consecutive_failures += 1

                if consecutive_failures >= COOLDOWN_THRESHOLD:
                    print(f"  ⚠ 연속 {consecutive_failures}회 실패 — {COOLDOWN_SECONDS}초 쿨다운 후 재개")
                    time.sleep(COOLDOWN_SECONDS)
                    consecutive_failures = 0

                time.sleep(random.uniform(4.0, 7.0))

        browser.close()
        save_json(TEAM_SLUG_MAP_PATH, team_slug_map)
        print(f"\n완료 — 성공 {success}건 / 실패 {fail}건 (슬러그 매핑 {len(team_slug_map)}건 저장)")


if __name__ == "__main__":
    main()