import { useState, useEffect } from 'react'
import type { SeasonStats, SeasonData, YearTab } from '../types'

// FastAPI 백엔드에서 선수 스탯 fetch
// career → /api/players/{id}/total
// 단일연도 → /api/players/{id}/{year}
async function fetchStats(playerId: number, year: YearTab): Promise<SeasonStats> {
  const url = year === 'career'
    ? `/api/players/${playerId}/total`
    : `/api/players/${playerId}/${year}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Not found')
  const data = await res.json()
  const s = data.statistics
  return {
    appearances:            s.appearances            ?? 0,
    matchesStarted:         s.matchesStarted         ?? 0,
    minutesPlayed:          s.minutesPlayed          ?? 0,
    totwAppearances:        s.totwAppearances        ?? 0,
    goals:                  s.goals                  ?? 0,
    expectedGoals:          s.expectedGoals          ?? 0,
    totalShots:             s.totalShots             ?? 0,
    shotsOnTarget:          s.shotsOnTarget          ?? 0,
    bigChancesCreated:      s.bigChancesCreated      ?? 0,
    bigChancesMissed:       s.bigChancesMissed       ?? 0,
    goalsFromInsideTheBox:  s.goalsFromInsideTheBox  ?? 0,
    shotsFromInsideTheBox:  s.shotsFromInsideTheBox  ?? 0,
    goalsFromOutsideTheBox: s.goalsFromOutsideTheBox ?? 0,
    shotsFromOutsideTheBox: s.shotsFromOutsideTheBox ?? 0,
    headedGoals:            s.headedGoals            ?? 0,
    leftFootGoals:          s.leftFootGoals          ?? 0,
    rightFootGoals:         s.rightFootGoals         ?? 0,
    freeKickGoal:           s.freeKickGoal           ?? 0,
    penaltyGoals:           s.penaltyGoals           ?? 0,
    penaltiesTaken:         s.penaltiesTaken         ?? 0,
    penaltyWon:             s.penaltyWon             ?? 0,
    hitWoodwork:            s.hitWoodwork            ?? 0,
    assists:                s.assists                ?? 0,
    expectedAssists:        s.expectedAssists        ?? 0,
    touches:                s.touches                ?? 0,
    accuratePasses:         s.accuratePasses         ?? 0,
    totalPasses:            s.totalPasses            ?? 0,
    keyPasses:              s.keyPasses              ?? 0,
    accurateLongBalls:      s.accurateLongBalls      ?? 0,
    totalLongBalls:         s.totalLongBalls         ?? 0,
    accurateCrosses:        s.accurateCrosses        ?? 0,
    totalCross:             s.totalCross             ?? 0,
    accurateChippedPasses:  s.accurateChippedPasses  ?? 0,
    totalChippedPasses:     s.totalChippedPasses     ?? 0,
    interceptions:          s.interceptions          ?? 0,
    tacklesWon:             s.tacklesWon             ?? 0,
    tackles:                s.tackles                ?? 0,
    clearances:             s.clearances             ?? 0,
    blockedShots:           s.blockedShots           ?? 0,
    errorLeadToShot:        s.errorLeadToShot        ?? 0,
    errorLeadToGoal:        s.errorLeadToGoal        ?? 0,
    penaltyConceded:        s.penaltyConceded        ?? 0,
    successfulDribbles:     s.successfulDribbles     ?? 0,
    totalDribbles:          (s.successfulDribbles ?? 0) + (s.failedToControlCount ?? 0),
    totalDuelsWon:          s.totalDuelsWon          ?? 0,
    totalDuels:             (s.totalDuelsWon ?? 0) + (s.duelLost ?? 0),
    groundDuelsWon:         s.groundDuelsWon         ?? 0,
    groundDuels:            (s.groundDuelsWon ?? 0) + (s.duelLost ?? 0),
    aerialDuelsWon:         s.aerialDuelsWon         ?? 0,
    aerialDuels:            (s.aerialDuelsWon ?? 0) + (s.aerialLost ?? 0),
    possessionLost:         s.possessionLost         ?? 0,
    fouls:                  s.fouls                  ?? 0,
    wasFouled:              s.wasFouled              ?? 0,
    offsides:               s.offsides               ?? 0,
    yellowCards:            s.yellowCards            ?? 0,
    redCards:               s.redCards               ?? 0,
    rating:                 year === 'career' ? (data.career_rating ?? 0) : (s.rating ?? 0),
  }
}

// 선수 스탯 fetch 훅 — year 탭 변경 시 자동 재요청
export function usePlayerStats(playerId: number, year: YearTab) {
  const [seasonData, setSeasonData] = useState<SeasonData>({
    stats: null, loading: true, error: false,
  })

  useEffect(() => {
    setSeasonData(prev => ({ ...prev, loading: true, error: false }))
    fetchStats(playerId, year)
      .then(stats => setSeasonData({ stats, loading: false, error: false }))
      .catch(() => setSeasonData({ stats: null, loading: false, error: true }))
  }, [playerId, year])

  return seasonData
}