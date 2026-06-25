import { STAT_DEFINITIONS } from './constants'
import type { StatCategory, StatDefinition } from './types'

export function getStatsByCategory(category: StatCategory): StatDefinition[] {
  return STAT_DEFINITIONS.filter((def) => def.category === category)
}