import { useTranslation } from 'react-i18next'
import { useHistoryList } from './hooks/useHistoryList'
import { HistoryFeatured, HistoryListItem } from './components'

// History 목록 페이지
// 첫 번째 아티클(연도가 가장 이른 대회)은 좌측 대형 카드로, 나머지는 우측 리스트로 노출
export default function History() {
  const { t } = useTranslation('history')
  const { articles, loading, error } = useHistoryList()

  const [featured, ...rest] = articles

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

      {loading && <p className="text-muted-foreground">{t('loading')}</p>}
      {error && <p className="text-muted-foreground">{t('error')}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="text-muted-foreground">{t('empty')}</p>
      )}

      {featured && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HistoryFeatured article={featured} />
          </div>

          {/* 아티클이 1개뿐이면 우측 리스트는 비어있음 */}
          {rest.length > 0 && (
            <div className="flex flex-col">
              {rest.map((article) => (
                <HistoryListItem key={article.year} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}