import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import type { HistorySummary } from '../types'

// 목록 페이지 우측 리스트 아이템 (썸네일 + 연도 + 제목)
// FIFA 사이트의 "Latest news" 우측 리스트 형태를 참고한 레이아웃
export default function HistoryListItem({ article }: { article: HistorySummary }) {
  return (
    <Link
      to={`/history/${article.year}`}
      className="group flex items-center gap-3 py-3 border-b border-border last:border-b-0"
    >
      <div className="w-20 h-14 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <Trophy className="w-5 h-5 text-muted-foreground/30" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-semibold text-primary">{article.year}</span>
        <span className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </span>
      </div>
    </Link>
  )
}