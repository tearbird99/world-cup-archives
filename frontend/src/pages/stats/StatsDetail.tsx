import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WORLD_CUP_YEARS } from './constants'
import { usePlayerSeasonRankings } from './hooks/usePlayerSeasonRankings'
import { formatStatValue } from './utils'
import PlayerAvatar from './components/PlayerAvatar'

const PAGE_SIZE = 50

// 페이지 번호 배열 생성 — 현재 페이지 앞뒤 2개 + 첫/마지막 + 생략(...)
// (Players.tsx의 getPageNumbers와 동일한 로직)
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

export default function StatsDetail() {
  const { t } = useTranslation('stats')
  const { scope, stat } = useParams<{ entity: string; scope: string; stat: string }>()

  const isAllTime = scope === 'all-time'
  const year = isAllTime ? null : Number(scope)

  const { rankings, loading, error } = usePlayerSeasonRankings(isAllTime ? null : year)

  const entries = stat && rankings ? rankings[stat] ?? [] : []
  const statLabel = stat ? t(`stat.${stat}`, { defaultValue: stat }) : ''

  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedEntries = entries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // 스탯/연도가 바뀌면 1페이지로 리셋
  useEffect(() => {
    setPage(1)
    setPageInput('1')
  }, [scope, stat])

  function goToPage(target: number) {
    const clamped = Math.min(Math.max(1, target), totalPages)
    setPage(clamped)
    setPageInput(String(clamped))
  }

  function handlePageInputSubmit() {
    const parsed = Number(pageInput)
    if (Number.isNaN(parsed)) {
      setPageInput(String(currentPage))
      return
    }
    goToPage(parsed)
  }

  return (
    <div className="space-y-6">
      <Link
        to="/stats"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back_to_overview')}
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{statLabel}</h1>
        <p className="text-muted-foreground">
          {isAllTime ? t('all_time') : t('tournament', { year })}
        </p>
      </div>

      {/* 연도 선택 (현재 스탯은 유지하고 연도만 전환) */}
      <div className="flex flex-wrap gap-2">
        {WORLD_CUP_YEARS.map((y) => (
          <Link
            key={y}
            to={`/stats/players/${y}/${stat}`}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              !isAllTime && year === y
                ? 'bg-lime-500 text-black'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {y}
          </Link>
        ))}
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
      {isAllTime && <p className="text-muted-foreground">{t('all_time_coming_soon')}</p>}

      {!loading && !error && !isAllTime && (
        <>
          <p className="text-sm text-muted-foreground">
            {t('total_players', { count: entries.length, page: currentPage, totalPages })}
          </p>

          <ol className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {paginatedEntries.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">{t('no_data')}</li>
            )}
            {paginatedEntries.map((entry, index) => (
              <li key={entry.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-8 text-muted-foreground tabular-nums">
                  {(currentPage - 1) * PAGE_SIZE + index + 1}
                </span>
                <Link
                  to={`/players/${entry.id}`}
                  className="flex items-center gap-2 min-w-0 flex-1 hover:text-lime-600 dark:hover:text-lime-400"
                >
                  <PlayerAvatar id={entry.id} name={entry.name} teamCode={entry.team_code} />
                  <span className="truncate">{entry.name}</span>
                  {entry.team && (
                    <span className="hidden sm:inline truncate text-xs text-muted-foreground">
                      {entry.team}
                    </span>
                  )}
                </Link>
                <span className="font-semibold tabular-nums shrink-0">
                  {stat ? formatStatValue(stat, entry.value) : entry.value}
                </span>
              </li>
            ))}
          </ol>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers(currentPage, totalPages).map((num, i) =>
                num === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={num}
                    onClick={() => goToPage(num)}
                    className={cn(
                      'min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors',
                      currentPage === num
                        ? 'bg-lime-500 text-black'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {/* 페이지 직접 입력 */}
              <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-border">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handlePageInputSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                  className="w-14 h-9 text-sm text-center rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">/ {totalPages}</span>
                <button
                  onClick={handlePageInputSubmit}
                  className="h-9 px-3 rounded-lg text-sm font-medium bg-lime-500 text-black hover:bg-lime-600 transition-colors"
                >
                  {t('go_to_page')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}