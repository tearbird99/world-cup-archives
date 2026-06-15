import type { StatMode } from './types'

export const MODE_KEYS: StatMode[] = ['total', 'per90', 'team']

export const RADAR_MAX = {
  career_total: {
    attacking:  { goals: 20, totalShots: 80, shotsOnTarget: 60, goalsFromInsideTheBox: 15, goalsFromOutsideTheBox: 6 },
    passing:    { assists: 15, keyPasses: 100, bigChancesCreated: 16, accuratePasses: 1200, accurateLongBalls: 100 },
    dribbling:  { successfulDribbles: 150, groundDuelsWon: 250, aerialDuelsWon: 50, totalDuelsWon: 300, wasFouled: 50 },
    defending:  { tackles: 100, tacklesWon: 60, interceptions: 30, clearances: 60, blockedShots: 30 },
  },
  season_total: {
    attacking:  { goals: 8, totalShots: 30, shotsOnTarget: 25, goalsFromInsideTheBox: 10, goalsFromOutsideTheBox: 5 },
    passing:    { assists: 6, keyPasses: 30, bigChancesCreated: 10, accuratePasses: 350, accurateLongBalls: 30 },
    dribbling:  { successfulDribbles: 50, groundDuelsWon: 120, aerialDuelsWon: 50, totalDuelsWon: 200, wasFouled: 50 },
    defending:  { tackles: 25, tacklesWon: 15, interceptions: 8, clearances: 15, blockedShots: 10 },
  },
  per90: {
    attacking:  { goals: 1.2, totalShots: 7.0, shotsOnTarget: 4.0, goalsFromInsideTheBox: 1.0, goalsFromOutsideTheBox: 0.5 },
    passing:    { assists: 0.8, keyPasses: 6.0, bigChancesCreated: 1.0, accuratePasses: 60.0, accurateLongBalls: 6.0, },
    dribbling:  { successfulDribbles: 6.0, groundDuelsWon: 12.0, aerialDuelsWon: 4.0, totalDuelsWon: 14.0, wasFouled: 5.0 },
    defending:  { tackles: 7.0, tacklesWon: 4.0, interceptions: 2.0, clearances: 4.0, blockedShots: 2.0 },
  },
  team: {
    attacking:  { goals: 20, totalShots: 80, shotsOnTarget: 60, goalsFromInsideTheBox: 15, goalsFromOutsideTheBox: 6 },
    passing:    { assists: 15, keyPasses: 100, bigChancesCreated: 16, accuratePasses: 1200, accurateLongBalls: 100 },
    dribbling:  { successfulDribbles: 150, groundDuelsWon: 250, aerialDuelsWon: 50, totalDuelsWon: 300, wasFouled: 50 },
    defending:  { tackles: 100, tacklesWon: 60, interceptions: 30, clearances: 60, blockedShots: 30 },
  },
}

export type RadarCategory = keyof typeof RADAR_MAX.career_total

export function getMaxMaps(mode: StatMode, isCareer: boolean) {
  if (mode === 'per90') return RADAR_MAX.per90
  if (mode === 'team')  return RADAR_MAX.team
  return isCareer ? RADAR_MAX.career_total : RADAR_MAX.season_total
}