export type StatEntity = 'players' | 'teams'
export type StatScope = 'all-time' | number

export interface RankingEntry {
  id: number
  name: string
  team: string | null
  team_slug: string | null
  value: number
}

export type StatCategory = 'matches' | 'attacking' | 'passing' | 'defending' | 'other'

export interface StatDefinition {
  key: string
  category: StatCategory
  relatedStat?: string
}

export type RankingsByStat = Record<string, RankingEntry[]>