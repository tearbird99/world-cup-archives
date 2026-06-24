import type { StatMode } from './types'

export const MODE_KEYS: StatMode[] = ['total', 'per90']

// 대회 1회 출전 기준 상한값 (선수 개인 누적치보다 훨씬 큰 스케일)
export const RADAR_MAX = {
  season_total: {
    attacking:  { goalsScored: 20, shots: 120, shotsOnTarget: 60, goalsFromInsideTheBox: 16, goalsFromOutsideTheBox: 6 },
    passing:    { assists: 15, accuratePasses: 600, bigChancesCreated: 20, accurateLongBalls: 100, accurateCrosses: 30 },
    duels:      { successfulDribbles: 60, groundDuelsWon: 300, aerialDuelsWon: 120, duelsWon: 400, fouls: 100 },
    defending:  { tackles: 150, interceptions: 70, clearances: 150, saves: 30, cleanSheets: 5 },
  },
  per90: {
    attacking:  { goalsScored: 2.5, shots: 15.0, shotsOnTarget: 8.0, goalsFromInsideTheBox: 2.0, goalsFromOutsideTheBox: 1.0 },
    passing:    { assists: 2.0, accuratePasses: 80.0, bigChancesCreated: 3.0, accurateLongBalls: 14.0, accurateCrosses: 4.0 },
    duels:      { successfulDribbles: 8.0, groundDuelsWon: 40.0, aerialDuelsWon: 16.0, duelsWon: 55.0, fouls: 14.0 },
    defending:  { tackles: 20.0, interceptions: 10.0, clearances: 20.0, saves: 5.0, cleanSheets: 1.0 },
  },
}

export type RadarCategory = keyof typeof RADAR_MAX.season_total

export function getMaxMaps(mode: StatMode) {
  return mode === 'per90' ? RADAR_MAX.per90 : RADAR_MAX.season_total
}