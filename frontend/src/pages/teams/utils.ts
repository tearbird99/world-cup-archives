import type { StatMode } from './types'

// 값을 90분(1경기) 기준으로 환산
// 팀 통계는 matches 단위이므로 분 대신 "경기 수"를 받아 90분 1경기 기준으로 나눈다
export function p90(value: number, matches: number): number {
  if (!matches) return 0
  return value / matches
}

// 스탯 값 포맷
// skip=true: per90 변환 없이 원래 값 그대로 반환 (경기 수, 평점 등 누적 의미 없는 항목)
export function fmt(value: number, mode: StatMode, matches: number, skip = false): string {
  if (skip) return Number.isInteger(value) ? String(value) : value.toFixed(2)
  const v = mode === 'per90' ? p90(value, matches) : value
  return mode === 'per90' ? v.toFixed(2) : (Number.isInteger(v) ? String(v) : v.toFixed(2))
}

// 성공/시도 비율 포맷 — ex) "320 (86%)"
// per90 모드에서는 성공 수를 경기당 환산해서 표시, 비율(%)은 원래 값 기준 유지
export function fmtPct(acc: number, total: number, mode: StatMode, matches: number): string {
  const a = mode === 'per90' ? p90(acc, matches) : acc
  const pct = total > 0 ? Math.round((acc / total) * 100) : 0
  return `${mode === 'per90' ? a.toFixed(2) : Math.round(a)} (${pct}%)`
}

// 레이더 차트용 데이터 생성
// 각 항목을 상한값(maxMap) 대비 0~100으로 정규화해서 value에 저장
// raw에는 원래 값(또는 per90 환산값)을 보관 → 툴팁에서 표시
export function buildRadar(
  items: { label: string; value: number }[],
  maxMap: Record<string, number>,
  mode: StatMode,
  matches: number,
) {
  return items.map(({ label, value }) => {
    const rawVal = mode === 'per90' ? p90(value, matches) : value
    const max = maxMap[label] ?? 1
    return { label, raw: parseFloat(rawVal.toFixed(2)), value: Math.min((rawVal / max) * 100, 100) }
  })
}