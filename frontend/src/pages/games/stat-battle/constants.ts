import type { BattleStatKey } from './types'

export const DECK_SIZE = 8
export const MIN_APPEARANCES = 7

// 라운드마다 비교 대상이 되는 스탯 목록
export const BATTLE_STATS: { key: BattleStatKey; labelKey: string }[] = [
  { key: 'goals', labelKey: 'stat_goals' },
  { key: 'assists', labelKey: 'stat_assists' },
  { key: 'appearances', labelKey: 'stat_appearances' },
  { key: 'career_rating', labelKey: 'stat_rating' },
]

// 스탯별 강조 색상
export const STAT_COLOR: Record<BattleStatKey, string> = {
  goals: 'text-lime-700 dark:text-lime-400',
  assists: 'text-teal-700 dark:text-teal-400',
  appearances: 'text-zinc-700 dark:text-zinc-300',
  career_rating: 'text-amber-700 dark:text-amber-400',
}