import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import type { HistorySummary } from '../types'

// 목록 페이지 좌측 대형 카드 (가장 오래된/첫 번째 아티클)
// FIFA 사이트의 "Latest news" 메인 배너 형태를 참고한 레이아웃
export default function HistoryFeatured({ article }: { article: HistorySummary }) {
  return (
    <Link
      to={`/history/${article.year}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
    >
      <div className="h-48 sm:h-64 w-full overflow-hidden bg-muted flex items-center justify-center">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.style.display = 'none' }} // 이미지 없을 시 트로피 아이콘 노출
          />
        ) : (
          <Trophy className="w-10 h-10 text-muted-foreground/30" />
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold text-primary">
          {article.year} · {article.host}
        </span>
        <h2 className="text-lg font-bold leading-snug">{article.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
      </div>
    </Link>
  )
}