export type StatMode = 'total' | 'per90' | 'team'
export type YearTab = number | 'career'

export interface SeasonStats {
  appearances: number
  matchesStarted: number
  minutesPlayed: number
  totwAppearances: number
  goals: number
  expectedGoals: number | null
  totalShots: number
  shotsOnTarget: number
  bigChancesCreated: number
  bigChancesMissed: number
  goalsFromInsideTheBox: number
  shotsFromInsideTheBox: number
  goalsFromOutsideTheBox: number
  shotsFromOutsideTheBox: number
  headedGoals: number
  leftFootGoals: number
  rightFootGoals: number
  freeKickGoal: number
  penaltyGoals: number
  penaltiesTaken: number
  penaltyWon: number
  hitWoodwork: number
  assists: number
  expectedAssists: number | null
  touches: number
  accuratePasses: number
  totalPasses: number
  keyPasses: number
  accurateLongBalls: number
  totalLongBalls: number
  accurateCrosses: number
  totalCross: number
  accurateChippedPasses: number
  totalChippedPasses: number
  interceptions: number
  tacklesWon: number
  tackles: number
  clearances: number
  blockedShots: number
  errorLeadToShot: number
  errorLeadToGoal: number
  penaltyConceded: number
  successfulDribbles: number
  totalDribbles: number
  totalDuelsWon: number
  totalDuels: number
  groundDuelsWon: number
  groundDuels: number
  aerialDuelsWon: number
  aerialDuels: number
  possessionLost: number
  fouls: number
  wasFouled: number
  offsides: number
  yellowCards: number
  redCards: number
  rating: number
}

export interface SeasonData {
  stats: SeasonStats | null
  loading: boolean
  error: boolean
}