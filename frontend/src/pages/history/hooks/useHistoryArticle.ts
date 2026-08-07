import { useState, useEffect } from 'react'
import type { HistoryArticle } from '../types'

// FastAPI 백엔드에서 특정 연도의 History 아티클 상세 fetch
// /api/history/{year} → frontmatter + 마크다운 본문
export function useHistoryArticle(year: number) {
  const [article, setArticle] = useState<HistoryArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // year(파라미터)가 바뀔 때마다 로딩 상태 초기화 후 재요청
    setLoading(true)
    setError(false)
    fetch(`/api/history/${year}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(setArticle)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [year])

  return { article, loading, error }
}