import type { StatCategory, StatDefinition } from './types'

export const STAT_CATEGORIES: StatCategory[] = [
  'matches',
  'attacking',
  'passing',
  'defending',
  'other',
]

// PlayerDetail/TeamDetail의 섹션 구분(공격/패스/수비/기타)과 동일한 기준으로 분류
export const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'minutesPlayed', category: 'matches' },
  { key: 'rating', category: 'matches' },

  { key: 'goals', category: 'attacking', relatedStat: 'penaltyGoals' },
  { key: 'goalsAssistsSum', category: 'attacking' },
  { key: 'leftFootGoals', category: 'attacking' },
  { key: 'rightFootGoals', category: 'attacking' },
  { key: 'headedGoals', category: 'attacking' },
  { key: 'goalsFromOutsideTheBox', category: 'attacking' },
  { key: 'freeKickGoal', category: 'attacking' },
  { key: 'penaltyGoals', category: 'attacking' },
  { key: 'bigChancesMissed', category: 'attacking' },
  { key: 'totalShots', category: 'attacking' },
  { key: 'shotsOnTarget', category: 'attacking' },

  { key: 'assists', category: 'passing' },
  { key: 'keyPasses', category: 'passing' },
  { key: 'bigChancesCreated', category: 'passing' },
  { key: 'accuratePasses', category: 'passing' },
  { key: 'accurateOppositionHalfPasses', category: 'passing' },
  { key: 'accurateFinalThirdPasses', category: 'passing' },
  { key: 'accurateLongBalls', category: 'passing' },
  { key: 'accurateCrosses', category: 'passing' },

  { key: 'tacklesWon', category: 'defending' },
  { key: 'interceptions', category: 'defending' },
  { key: 'clearances', category: 'defending' },
  { key: 'ballRecovery', category: 'defending' },
  { key: 'blockedShots', category: 'defending' },
  { key: 'yellowCards', category: 'defending' },
  { key: 'redCards', category: 'defending' },
  { key: 'saves', category: 'defending' },
  { key: 'cleanSheet', category: 'defending' },
  { key: 'successfulRunsOut', category: 'defending' },

  { key: 'touches', category: 'other' },
  { key: 'successfulDribbles', category: 'other' },
  { key: 'groundDuelsWon', category: 'other' },
  { key: 'aerialDuelsWon', category: 'other' },
  { key: 'totalDuelsWon', category: 'other' },
  { key: 'wasFouled', category: 'other' },
  { key: 'fouls', category: 'other' },
]

// World Cup Archives가 다루는 대회 연도 (오래된 순)
export const WORLD_CUP_YEARS = [
  1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994,
  1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026,
]

export const STAT_DEFINITION_MAP: Record<string, StatDefinition> = Object.fromEntries(
  STAT_DEFINITIONS.map((def) => [def.key, def])
)