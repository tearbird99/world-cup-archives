import { useState, useEffect } from 'react'
import type { TeamSeasonStats, TeamSeasonData, YearTab } from '../types'

// FastAPI 백엔드에서 팀 스탯 fetch
// /api/teams/{id}/{year}
async function fetchTeamStats(teamId: number, year: YearTab): Promise<TeamSeasonStats> {
  const url = `/api/teams/${teamId}/${year}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Not found')
  const data = await res.json()
  const s = data.statistics
  return {
    matches:                                s.matches                                ?? 0,
    awardedMatches:                         s.awardedMatches                         ?? 0,
    avgRating:                              s.avgRating                              ?? 0,

    goalsScored:                            s.goalsScored                            ?? 0,
    goalsConceded:                          s.goalsConceded                          ?? 0,
    ownGoals:                               s.ownGoals                               ?? 0,
    assists:                                s.assists                                ?? 0,
    shots:                                  s.shots                                  ?? 0,
    penaltyGoals:                           s.penaltyGoals                           ?? 0,
    penaltiesTaken:                         s.penaltiesTaken                         ?? 0,
    freeKickGoals:                          s.freeKickGoals                          ?? 0,
    freeKickShots:                          s.freeKickShots                          ?? 0,
    goalsFromInsideTheBox:                  s.goalsFromInsideTheBox                  ?? 0,
    goalsFromOutsideTheBox:                 s.goalsFromOutsideTheBox                 ?? 0,
    shotsFromInsideTheBox:                  s.shotsFromInsideTheBox                  ?? 0,
    shotsFromOutsideTheBox:                 s.shotsFromOutsideTheBox                 ?? 0,
    headedGoals:                            s.headedGoals                            ?? 0,
    leftFootGoals:                          s.leftFootGoals                          ?? 0,
    rightFootGoals:                         s.rightFootGoals                         ?? 0,
    bigChances:                             s.bigChances                             ?? 0,
    bigChancesCreated:                      s.bigChancesCreated                      ?? 0,
    bigChancesMissed:                       s.bigChancesMissed                       ?? 0,
    shotsOnTarget:                          s.shotsOnTarget                          ?? 0,
    shotsOffTarget:                         s.shotsOffTarget                         ?? 0,
    blockedScoringAttempt:                  s.blockedScoringAttempt                  ?? 0,
    successfulDribbles:                     s.successfulDribbles                     ?? 0,
    dribbleAttempts:                        s.dribbleAttempts                        ?? 0,
    corners:                                s.corners                                ?? 0,
    hitWoodwork:                            s.hitWoodwork                            ?? 0,
    fastBreaks:                             s.fastBreaks                             ?? 0,
    fastBreakGoals:                         s.fastBreakGoals                         ?? 0,
    fastBreakShots:                         s.fastBreakShots                         ?? 0,

    averageBallPossession:                  s.averageBallPossession                  ?? 0,
    totalPasses:                            s.totalPasses                            ?? 0,
    accuratePasses:                         s.accuratePasses                         ?? 0,
    accuratePassesPercentage:               s.accuratePassesPercentage               ?? 0,
    totalOwnHalfPasses:                     s.totalOwnHalfPasses                     ?? 0,
    accurateOwnHalfPasses:                  s.accurateOwnHalfPasses                  ?? 0,
    accurateOwnHalfPassesPercentage:        s.accurateOwnHalfPassesPercentage        ?? 0,
    totalOppositionHalfPasses:              s.totalOppositionHalfPasses              ?? 0,
    accurateOppositionHalfPasses:           s.accurateOppositionHalfPasses           ?? 0,
    accurateOppositionHalfPassesPercentage: s.accurateOppositionHalfPassesPercentage ?? 0,
    totalLongBalls:                         s.totalLongBalls                         ?? 0,
    accurateLongBalls:                      s.accurateLongBalls                      ?? 0,
    accurateLongBallsPercentage:            s.accurateLongBallsPercentage            ?? 0,
    totalCrosses:                           s.totalCrosses                           ?? 0,
    accurateCrosses:                        s.accurateCrosses                        ?? 0,
    accurateCrossesPercentage:              s.accurateCrossesPercentage              ?? 0,

    cleanSheets:                            s.cleanSheets                            ?? 0,
    tackles:                                s.tackles                                ?? 0,
    interceptions:                          s.interceptions                          ?? 0,
    saves:                                  s.saves                                  ?? 0,
    errorsLeadingToGoal:                    s.errorsLeadingToGoal                    ?? 0,
    errorsLeadingToShot:                    s.errorsLeadingToShot                    ?? 0,
    penaltiesCommited:                      s.penaltiesCommited                      ?? 0,
    penaltyGoalsConceded:                   s.penaltyGoalsConceded                   ?? 0,
    clearances:                             s.clearances                             ?? 0,
    clearancesOffLine:                      s.clearancesOffLine                      ?? 0,
    lastManTackles:                         s.lastManTackles                         ?? 0,

    totalDuels:                             s.totalDuels                             ?? 0,
    duelsWon:                               s.duelsWon                               ?? 0,
    duelsWonPercentage:                     s.duelsWonPercentage                     ?? 0,
    totalGroundDuels:                       s.totalGroundDuels                       ?? 0,
    groundDuelsWon:                         s.groundDuelsWon                         ?? 0,
    groundDuelsWonPercentage:               s.groundDuelsWonPercentage               ?? 0,
    totalAerialDuels:                       s.totalAerialDuels                       ?? 0,
    aerialDuelsWon:                         s.aerialDuelsWon                         ?? 0,
    aerialDuelsWonPercentage:               s.aerialDuelsWonPercentage               ?? 0,
    possessionLost:                         s.possessionLost                         ?? 0,
    offsides:                               s.offsides                               ?? 0,
    fouls:                                  s.fouls                                  ?? 0,
    yellowCards:                            s.yellowCards                            ?? 0,
    yellowRedCards:                         s.yellowRedCards                         ?? 0,
    redCards:                               s.redCards                               ?? 0,
    throwIns:                               s.throwIns                               ?? 0,
    goalKicks:                              s.goalKicks                              ?? 0,
    ballRecovery:                           s.ballRecovery                           ?? 0,
    freeKicks:                              s.freeKicks                              ?? 0,
  }
}

// 팀 스탯 fetch 훅 — year 탭 변경 시 자동 재요청
export function useTeamStats(teamId: number, year: YearTab) {
  const [seasonData, setSeasonData] = useState<TeamSeasonData>({
    stats: null, loading: true, error: false,
  })

  useEffect(() => {
    // year가 아직 정해지지 않은 초기 상태(0)에는 불필요한 404 요청을 보내지 않는다.
    // 연도 목록이 로드되어 activeYear가 정해지면 그때 다시 fetch된다.
    if (!teamId || !year) {
      setSeasonData({ stats: null, loading: true, error: false })
      return
    }
    setSeasonData(prev => ({ ...prev, loading: true, error: false }))
    fetchTeamStats(teamId, year)
      .then(stats => setSeasonData({ stats, loading: false, error: false }))
      .catch(() => setSeasonData({ stats: null, loading: false, error: true }))
  }, [teamId, year])

  return seasonData
}