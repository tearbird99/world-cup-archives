import type { PlayerSummary } from '../../players/PlayerCard'

export type BattleStatKey = 'goals' | 'assists' | 'appearances' | 'career_rating'
export type Owner = 'player' | 'cpu'

export interface BattleState {
  playerDeck: PlayerSummary[]
  cpuDeck: PlayerSummary[]
  turn: Owner
  revealedStat: BattleStatKey | null
  roundWinner: Owner | 'tie' | null
  isOver: boolean
  gameWinner: Owner | 'tie' | null
}