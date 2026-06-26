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
  const [selectedYear, setSelectedYear] = useState<number | 'all-time'>(latestYear)
  const isAllTime = selectedYear === 'all-time'

  const { rankings, loading, error } = usePlayerSeasonRankings(isAllTime ? null : selectedYear)

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
            onClick={() => setSelectedYear(year)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedYear === year
                ? 'bg-lime-500 text-black'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {year}
          </button>
        ))}

        {/* All-Time 역대 전체 */}
        <button
          disabled
          title={t('all_time_coming_soon')}
          className="px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
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
                      detailHref={`/stats/players/${selectedYear}/${def.key}`}
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