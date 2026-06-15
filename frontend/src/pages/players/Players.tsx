import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import PlayerCard, { type PlayerSummary } from '@/components/players/PlayerCard'
import { PLAYERS } from '@/components/players/playersData'

type SortKey = 'name' | 'goals' | 'appearances' | 'rating'

export default function Players() {
  const { t } = useTranslation('players')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('appearances')

  const filtered = useMemo(() => {
    let list = [...PLAYERS]

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nationality.toLowerCase().includes(q),
      )
    }

    list.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      if (sortKey === 'goals') return b.goals - a.goals
      if (sortKey === 'appearances') return b.appearances - a.appearances
      if (sortKey === 'rating') return (b.career_rating ?? 0) - (a.career_rating ?? 0)
      return 0
    })

    return list
  }, [query, sortKey])

  return (
    <div className="min-h-screen">
      {/* 헤더 배너 */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {t('title')}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t('subtitle')}
          </p>

          {/* 검색 + 정렬 */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {/* 검색창 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>

            {/* 정렬 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {t('sort_label')}
              </span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="appearances">{t('sort_appearances')}</option>
                <option value="goals">{t('sort_goals')}</option>
                <option value="rating">{t('sort_rating')}</option>
                <option value="name">{t('sort_name')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">{t('no_results')}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((player, i) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}