export type StatMode = 'total' | 'per90'
export type YearTab = number

export interface TeamSeasonStats {
  // 매치
  matches: number
  awardedMatches: number
  avgRating: number

  // 공격
  goalsScored: number
  goalsConceded: number
  ownGoals: number
  assists: number
  shots: number
  penaltyGoals: number
  penaltiesTaken: number
  freeKickGoals: number
  freeKickShots: number
  goalsFromInsideTheBox: number
  goalsFromOutsideTheBox: number
  shotsFromInsideTheBox: number
  shotsFromOutsideTheBox: number
  headedGoals: number
  leftFootGoals: number
  rightFootGoals: number
  bigChances: number
  bigChancesCreated: number
  bigChancesMissed: number
  shotsOnTarget: number
  shotsOffTarget: number
  blockedScoringAttempt: number
  successfulDribbles: number
  dribbleAttempts: number
  corners: number
  hitWoodwork: number
  fastBreaks: number
  fastBreakGoals: number
  fastBreakShots: number

  // 패스
  averageBallPossession: number
  totalPasses: number
  accuratePasses: number
  accuratePassesPercentage: number
  totalOwnHalfPasses: number
  accurateOwnHalfPasses: number
  accurateOwnHalfPassesPercentage: number
  totalOppositionHalfPasses: number
  accurateOppositionHalfPasses: number
  accurateOppositionHalfPassesPercentage: number
  totalLongBalls: number
  accurateLongBalls: number
  accurateLongBallsPercentage: number
  totalCrosses: number
  accurateCrosses: number
  accurateCrossesPercentage: number

  // 수비
  cleanSheets: number
  tackles: number
  interceptions: number
  saves: number
  errorsLeadingToGoal: number
  errorsLeadingToShot: number
  penaltiesCommited: number
  penaltyGoalsConceded: number
  clearances: number
  clearancesOffLine: number
  lastManTackles: number

  // 듀얼/기타
  totalDuels: number
  duelsWon: number
  duelsWonPercentage: number
  totalGroundDuels: number
  groundDuelsWon: number
  groundDuelsWonPercentage: number
  totalAerialDuels: number
  aerialDuelsWon: number
  aerialDuelsWonPercentage: number
  possessionLost: number
  offsides: number
  fouls: number
  yellowCards: number
  yellowRedCards: number
  redCards: number
  throwIns: number
  goalKicks: number
  ballRecovery: number
  freeKicks: number

  // Against(상대 팀 기준) — 1단계에서는 미사용, 추후 확장용으로 타입만 보관
  accurateFinalThirdPassesAgainst?: number
  accurateOppositionHalfPassesAgainst?: number
  accurateOwnHalfPassesAgainst?: number
  accuratePassesAgainst?: number
  bigChancesAgainst?: number
  bigChancesCreatedAgainst?: number
  bigChancesMissedAgainst?: number
  clearancesAgainst?: number
  cornersAgainst?: number
  crossesSuccessfulAgainst?: number
  crossesTotalAgainst?: number
  dribbleAttemptsTotalAgainst?: number
  dribbleAttemptsWonAgainst?: number
  errorsLeadingToGoalAgainst?: number
  errorsLeadingToShotAgainst?: number
  hitWoodworkAgainst?: number
  interceptionsAgainst?: number
  keyPassesAgainst?: number
  longBallsSuccessfulAgainst?: number
  longBallsTotalAgainst?: number
  offsidesAgainst?: number
  redCardsAgainst?: number
  shotsAgainst?: number
  shotsBlockedAgainst?: number
  shotsFromInsideTheBoxAgainst?: number
  shotsFromOutsideTheBoxAgainst?: number
  shotsOffTargetAgainst?: number
  shotsOnTargetAgainst?: number
  blockedScoringAttemptAgainst?: number
  tacklesAgainst?: number
  totalFinalThirdPassesAgainst?: number
  oppositionHalfPassesTotalAgainst?: number
  ownHalfPassesTotalAgainst?: number
  totalPassesAgainst?: number
  yellowCardsAgainst?: number
}

export interface TeamSeasonData {
  stats: TeamSeasonStats | null
  loading: boolean
  error: boolean
}