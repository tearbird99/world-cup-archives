import { Link } from 'react-router-dom'
import type { HistorySummary } from '../types'

export default function HistoryCard({ article }: { article: HistorySummary }) {
  return (
    <Link
      to={`/history/${article.year}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-colors"
    >
      {article.cover_image && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-4">
        <span className="text-xs font-semibold text-primary">{article.year}</span>
        <h3 className="font-bold text-sm leading-snug">{article.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
        <span className="text-xs text-muted-foreground mt-1">🏆 {article.champion}</span>
      </div>
    </Link>
  )
}