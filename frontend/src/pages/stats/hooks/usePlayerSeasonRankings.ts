import { useEffect, useState } from 'react'
import type { RankingsByStat } from '../types'

export function usePlayerSeasonRankings(year: number | null) {
  const [rankings, setRankings] = useState<RankingsByStat | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (year === null) {
      setRankings(null)
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/api/stats/players/${year}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch rankings')
        return res.json()
      })
      .then((data: RankingsByStat) => setRankings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [year])

  return { rankings, loading, error }
}