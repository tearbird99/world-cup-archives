import { STAT_DEFINITIONS } from './constants'
import type { StatCategory, StatDefinition } from './types'

export function getStatsByCategory(category: StatCategory): StatDefinition[] {
  return STAT_DEFINITIONS.filter((def) => def.category === category)
}

export function formatStatValue(statKey: string, value: number): string {
  if (statKey === 'rating' || statKey.endsWith('Percentage')) {
    return value.toFixed(2)
  }
  return String(value)
}