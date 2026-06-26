export type StatEntity = 'players' | 'teams'
export type StatScope = 'all-time' | number

export interface RankingEntry {
  id: number
  name: string
  team: string | null
  team_code: string | null
  value: number
}

export type StatCategory = 'matches' | 'attacking' | 'passing' | 'defending' | 'other'

export interface StatDefinition {
  key: string
  category: StatCategory
  relatedStat?: string
}

/* 연도별 랭킹 파일(data/players/{year}/rankings.json) 한 개의 구조 */
export type RankingsByStat = Record<string, RankingEntry[]>