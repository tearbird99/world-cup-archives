import { useState, useEffect } from 'react'
import type { HistorySummary } from '../types'

// FastAPI 백엔드에서 History 아티클 목록 fetch
// /api/history → 연도 오름차순으로 정렬된 배열
export function useHistoryList() {
  const [articles, setArticles] = useState<HistorySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/history')
      .then(res => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then(setArticles)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { articles, loading, error }
}