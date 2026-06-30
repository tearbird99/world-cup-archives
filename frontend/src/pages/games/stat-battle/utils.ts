import type { PlayerSummary } from '../../players/PlayerCard'
import { BATTLE_STATS, DECK_SIZE, MIN_APPEARANCES } from './constants'
import type { BattleStatKey, Owner } from './types'

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// 출전 경기가 너무 적은 선수는 게임에서 제외
export function getEligiblePool(pool: PlayerSummary[]): PlayerSummary[] {
  return pool.filter((p) => p.appearances >= MIN_APPEARANCES)
}

export function dealDecks(pool: PlayerSummary[]) {
  const eligible = getEligiblePool(pool)
  const shuffled = shuffle(eligible)
  const size = Math.min(DECK_SIZE, Math.floor(shuffled.length / 2))
  return {
    playerDeck: shuffled.slice(0, size),
    cpuDeck: shuffled.slice(size, size * 2),
  }
}

export function formatStat(key: BattleStatKey, value: number) {
  return key === 'career_rating' ? value.toFixed(2) : String(value)
}

export function compareStat(playerValue: number, cpuValue: number): Owner | 'tie' {
  if (playerValue === cpuValue) return 'tie'
  return playerValue > cpuValue ? 'player' : 'cpu'
}

// CPU는 자기 카드에서 가장 높은 스탯을 선택
export function pickStrongestStat(card: PlayerSummary): BattleStatKey {
  return BATTLE_STATS.reduce((best, stat) => (card[stat.key] > card[best.key] ? stat : best)).key
}