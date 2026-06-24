import { useState, useEffect } from 'react'

interface TeamYearsData {
  years: number[]
  loading: boolean
  error: boolean
}

// 팀이 실제로 통계 데이터를 가진 연도 목록을 가져오는 훅
// /api/teams/{team_id} 응답의 years_played를 그대로 사용
export function useTeamYears(teamId: number) {
  const [data, setData] = useState<TeamYearsData>({
    years: [], loading: true, error: false,
  })

  useEffect(() => {
    setData(prev => ({ ...prev, loading: true, error: false }))
    fetch(`/api/teams/${teamId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(json => setData({ years: json.years_played ?? [], loading: false, error: false }))
      .catch(() => setData({ years: [], loading: false, error: true }))
  }, [teamId])

  return data
}