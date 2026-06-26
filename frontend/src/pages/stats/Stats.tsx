import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { STAT_CATEGORIES, WORLD_CUP_YEARS } from './constants'
import { getStatsByCategory } from './utils'
import { usePlayerSeasonRankings } from './hooks/usePlayerSeasonRankings'
import StatCard from './components/StatCard'

export default function Stats() {
  const { t } = useTranslation('stats')
  const latestYear = WORLD_CUP_YEARS[WORLD_CUP_YEARS.length - 1]
  const [selectedScope, setSelectedScope] = useState<number | 'all-time'>(latestYear)
  const isAllTime = selectedScope === 'all-time'

  const { rankings, loading, error } = usePlayerSeasonRankings(selectedScope)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* 연도 선택 */}
      <div className="flex flex-wrap gap-2">
        {WORLD_CUP_YEARS.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedScope(year)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedScope === year
                ? 'bg-lime-500 text-black'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {year}
          </button>
        ))}

        <button
          onClick={() => setSelectedScope('all-time')}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isAllTime
              ? 'bg-lime-500 text-black'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {t('all_time')}
        </button>
      </div>

      {loading && <p className="text-muted-foreground">{t('loading')}</p>}
      {error && <p className="text-destructive">{t('error', { error })}</p>}

      {!loading && !error && rankings && (
        <div className="space-y-10">
          {STAT_CATEGORIES.map((category) => {
            const statsInCategory = getStatsByCategory(category)

            return (
              <section key={category}>
                <h2 className="text-lg font-semibold mb-3 text-lime-600 dark:text-lime-400">
                  {t(`category.${category}`)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsInCategory.map((def) => (
                    <StatCard
                      key={def.key}
                      statKey={def.key}
                      label={t(`stat.${def.key}`, { defaultValue: def.key })}
                      entries={rankings[def.key] ?? []}
                      detailHref={`/stats/players/${selectedScope}/${def.key}`}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}