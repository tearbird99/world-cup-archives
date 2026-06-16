import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import PlayerCard from '@/pages/players/PlayerCard'
import { PLAYERS } from '@/pages/players/playersData'

type SortKey = 'name' | 'goals' | 'appearances' | 'rating'

const PAGE_SIZE = 18

export default function Players() {
  const { t } = useTranslation('players')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('appearances')
  const [page, setPage] = useState(1)

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

  // 검색/정렬 변경 시 첫 페이지로 리셋
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleQueryChange(q: string) {
    setQuery(q)
    setPage(1)
  }

  function handleSortChange(s: SortKey) {
    setSortKey(s)
    setPage(1)
  }

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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {t('sort_label')}
              </span>
              <select
                value={sortKey}
                onChange={(e) => handleSortChange(e.target.value as SortKey)}
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
          <>
            {/* 결과 수 */}
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
              {filtered.length}명 · {currentPage}/{totalPages} 페이지
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginated.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                {/* 첫 페이지 */}
                <button
                  onClick={() => setPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                
                {/* 이전 */}
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* 페이지 번호 */}
                {getPageNumbers(currentPage, totalPages).map((num, i) =>
                  num === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-zinc-400 text-sm select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setPage(Number(num))}
                      className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors
                        ${currentPage === num
                          ? 'bg-lime-600 text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                      {num}
                    </button>
                  )
                )}

                {/* 다음 */}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* 마지막 페이지 */}
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// 페이지 번호 배열 생성 — 현재 페이지 앞뒤 2개 + 첫/마지막 + 생략(...)
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}