import { useState } from 'react'
import { cn } from '@/lib/utils'
import { STAT_CATEGORIES, WORLD_CUP_YEARS } from './constants'
import { getStatsByCategory } from './utils'
import { usePlayerSeasonRankings } from './hooks/usePlayerSeasonRankings'
import StatCard from './components/StatCard' 

const CATEGORY_LABELS: Record<string, string> = {
  matches: '경기',
  attacking: '공격',
  passing: '패스',
  defending: '수비',
  other: '기타',
}

export default function Stats() {
  const latestYear = WORLD_CUP_YEARS[WORLD_CUP_YEARS.length - 1]
  const [selectedYear, setSelectedYear] = useState<number | 'all-time'>(latestYear)
  const isAllTime = selectedYear === 'all-time'

  const { rankings, loading, error } = usePlayerSeasonRankings(isAllTime ? null : selectedYear)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Stats Leaders</h1>
        <p className="text-muted-foreground">대회별 선수 스탯 순위</p>
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

        <button
          disabled
          title="준비 중입니다"
          className="px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
        >
          All-Time
        </button>
      </div>

      {loading && <p className="text-muted-foreground">불러오는 중...</p>}
      {error && <p className="text-destructive">데이터를 불러오지 못했어요. ({error})</p>}

      {!loading && !error && rankings && (
        <div className="space-y-10">
          {STAT_CATEGORIES.map((category) => {
            const statsInCategory = getStatsByCategory(category)

            return (
              <section key={category}>
                <h2 className="text-lg font-semibold mb-3 text-lime-600 dark:text-lime-400">
                  {CATEGORY_LABELS[category]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsInCategory.map((def) => (
                    <StatCard
                      key={def.key}
                      label={def.key}
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