import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { RankingEntry } from '../types'

interface StatCardProps {
  label: string
  entries: RankingEntry[]
  detailHref: string
}

export default function StatCard({ label, entries, detailHref }: StatCardProps) {
  const top3 = entries.slice(0, 3)

  return (
    <Link
      to={detailHref}
      className="block rounded-lg border border-border bg-card p-4 hover:border-lime-500/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{label}</h3>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      {top3.length === 0 ? (
        <p className="text-sm text-muted-foreground">데이터 없음</p>
      ) : (
        <ul className="space-y-2">
          {top3.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{entry.name}</span>
              <span className="font-medium tabular-nums shrink-0 ml-2">{entry.value}</span>
            </li>
          ))}
        </ul>
      )}
    </Link>
  )
}