import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { RankingEntry } from '../types'
import { formatStatValue } from '../utils'
import PlayerAvatar from './PlayerAvatar'

interface StatCardProps {
  statKey: string
  label: string
  entries: RankingEntry[]
  detailHref: string
}

export default function StatCard({ statKey, label, entries, detailHref }: StatCardProps) {
  const top3 = entries.slice(0, 3)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:border-lime-500/50 transition-colors">
      {/* 헤더 — PlayerDetail/StatTable 섹션 헤더와 동일한 톤 */}
      <Link
        to={detailHref}
        className="flex items-center justify-between px-4 py-2.5 bg-lime-50 dark:bg-lime-900/20 hover:bg-lime-100 dark:hover:bg-lime-900/30 transition-colors"
      >
        <h3 className="font-semibold text-xs uppercase tracking-wide text-lime-800 dark:text-lime-400">
          {label}
        </h3>
        <ChevronRight className="w-4 h-4 text-lime-700 dark:text-lime-400" />
      </Link>

      <div className="p-4">
        {top3.length === 0 ? (
          <p className="text-sm text-muted-foreground">데이터 없음</p>
        ) : (
          <ul className="space-y-2">
            {top3.map((entry) => (
              <li key={entry.id} className="flex items-center gap-2 text-sm">
                <Link
                  to={`/players/${entry.id}`}
                  className="flex items-center gap-2 min-w-0 flex-1 hover:text-lime-600 dark:hover:text-lime-400"
                >
                  <PlayerAvatar id={entry.id} name={entry.name} teamCode={entry.team_code} />
                  <span className="truncate">{entry.name}</span>
                </Link>
                <span className="font-medium tabular-nums shrink-0">
                  {formatStatValue(statKey, entry.value)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}