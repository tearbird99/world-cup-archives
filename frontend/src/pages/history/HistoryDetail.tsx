import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'
import { useHistoryArticle } from './hooks/useHistoryArticle'

// History 상세 페이지 — /history/:year
// 마크다운 본문은 react-markdown으로 렌더링
export default function HistoryDetail() {
  const { year } = useParams<{ year: string }>()
  const { t } = useTranslation('history')
  const { article, loading, error } = useHistoryArticle(Number(year))

  if (loading) return <div className="px-6 py-10 max-w-3xl mx-auto text-muted-foreground">{t('loading')}</div>
  if (error || !article) return <div className="px-6 py-10 max-w-3xl mx-auto text-muted-foreground">{t('not_found')}</div>

  return (
    <article className="px-6 py-10 max-w-3xl mx-auto">
      <Link to="/history" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t('back')}
      </Link>

      {article.cover_image && (
        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted mb-6">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <span className="text-sm font-semibold text-primary">{article.year} · {article.host}</span>
      <h1 className="text-3xl font-bold mt-2 mb-1">{article.title}</h1>
      <p className="text-muted-foreground mb-8">🏆 {article.champion}</p>

      {/* prose 클래스는 @tailwindcss/typography 플러그인 필요 */}
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  )
}