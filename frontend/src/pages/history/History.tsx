import { useTranslation } from 'react-i18next'
import { useHistoryList } from './hooks/useHistoryList'
import { HistoryFeatured, HistoryListItem } from './components'

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

          {/* 피처드 카드 높이(h-48 sm:h-64 + 하단 텍스트)에 맞춰 최대 높이 지정, 초과 시 리스트만 자체 스크롤 */}
          {rest.length > 0 && (
            <div className="flex flex-col max-h-[420px] overflow-y-auto pr-1">
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