import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts'
import { TEST_PLAYERS } from '@/components/players/playersData'

// 타입
interface SeasonStats {
  appearances: number
  goals: number
  assists: number
  rating: number
  minutesPlayed: number
  shotsOnTarget: number
  keyPasses: number
  successfulDribbles: number
  tackles: number
  interceptions: number
  yellowCards: number
  redCards: number
}

interface SeasonData {
  year: number | 'total'
  stats: SeasonStats | null
  loading: boolean
  error: boolean
}

// 레이더 차트용 지표
function buildRadarData(stats: SeasonStats) {
  return [
    { label: '골',        value: stats.goals },
    { label: '어시스트',  value: stats.assists },
    { label: '유효슈팅',  value: stats.shotsOnTarget },
    { label: '키패스',    value: stats.keyPasses },
    { label: '드리블',    value: stats.successfulDribbles },
    { label: '태클',      value: stats.tackles },
    { label: '인터셉트',  value: stats.interceptions },
  ]
}

// API 호출
async function fetchStats(playerId: number, year: number | 'total'): Promise<SeasonStats> {
  const url = year === 'total'
    ? `/api/players/${playerId}/total`
    : `/api/players/${playerId}/${year}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Not found')
  const data = await res.json()

  const s = data.statistics
  return {
    appearances:        s.appearances      ?? 0,
    goals:              s.goals            ?? 0,
    assists:            s.assists          ?? 0,
    rating:             year === 'total' ? (data.career_rating ?? 0) : (s.rating ?? 0),
    minutesPlayed:      s.minutesPlayed    ?? 0,
    shotsOnTarget:      s.shotsOnTarget    ?? 0,
    keyPasses:          s.keyPasses        ?? 0,
    successfulDribbles: s.successfulDribbles ?? 0,
    tackles:            s.tackles          ?? 0,
    interceptions:      s.interceptions    ?? 0,
    yellowCards:        s.yellowCards      ?? 0,
    redCards:           s.redCards         ?? 0,
  }
}

// 스탯 테이블 행
const TABLE_ROWS: { label: string; key: keyof SeasonStats }[] = [
  { label: '출전',       key: 'appearances' },
  { label: '출전 시간',  key: 'minutesPlayed' },
  { label: '골',         key: 'goals' },
  { label: '어시스트',   key: 'assists' },
  { label: '평점',       key: 'rating' },
  { label: '유효슈팅',   key: 'shotsOnTarget' },
  { label: '키패스',     key: 'keyPasses' },
  { label: '드리블 성공', key: 'successfulDribbles' },
  { label: '태클',       key: 'tackles' },
  { label: '인터셉트',   key: 'interceptions' },
  { label: '경고',       key: 'yellowCards' },
  { label: '퇴장',       key: 'redCards' },
]

// 메인 컴포넌트
export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('players')

  const player = TEST_PLAYERS.find((p) => p.id === Number(id))

  // 선택된 탭: 연도 or 'total'
  const [selected, setSelected] = useState<number | 'total'>('total')
  const [seasonData, setSeasonData] = useState<SeasonData>({
    year: 'total', stats: null, loading: true, error: false,
  })

  useEffect(() => {
    if (!player) return
    setSeasonData(prev => ({ ...prev, loading: true, error: false }))
    fetchStats(player.id, selected)
      .then(stats => setSeasonData({ year: selected, stats, loading: false, error: false }))
      .catch(() => setSeasonData({ year: selected, stats: null, loading: false, error: true }))
  }, [selected, player?.id])

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-zinc-500">{t('no_results')}</p>
        <Link to="/players" className="text-lime-600 hover:underline text-sm">← {t('title')}</Link>
      </div>
    )
  }

  const flagUrl = player.nationality_code
    ? `https://flagcdn.com/w80/${player.nationality_code.toLowerCase()}.png`
    : null

  const tabs: (number | 'total')[] = [...player.seasons_played, 'total']

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* 뒤로 가기 */}
        <Link
          to="/players"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-lime-600 dark:hover:text-lime-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('title')}
        </Link>

        {/* 상단: 사진 + 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-10">

          {/* 사진 */}
          <div
            className="rounded-2xl overflow-hidden flex items-center justify-center h-72 relative"
            style={{ backgroundColor: player.team_color_primary + '20' }}
          >
            {flagUrl && (
              <img src={flagUrl} alt="" aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-[2px]" />
            )}
            <img
              src={`/players/${player.id}.webp`}
              alt={player.name}
              className="relative z-10 h-full w-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/players/default.webp' }}
            />
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{player.name}</h1>
            <div className="flex items-center gap-2">
              {flagUrl && <img src={flagUrl} alt={player.nationality} className="h-5 rounded-sm" />}
              <span className="text-zinc-500 dark:text-zinc-400">{player.nationality}</span>
            </div>

            {/* 빠른 스탯 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <BigStat label={t('card_appearances')} value={player.appearances} />
              <BigStat label={t('card_goals')} value={player.goals} accent="lime" />
              <BigStat label={t('card_assists')} value={player.assists} accent="teal" />
              <BigStat label={t('card_rating')} value={player.career_rating.toFixed(2)} accent="amber" />
            </div>
          </div>
        </div>

        {/* 연도 탭 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelected(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${selected === tab
                  ? 'bg-lime-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
            >
              {tab === 'total' ? 'Total' : tab}
            </button>
          ))}
        </div>

        {/* 스탯 영역 */}
        {seasonData.loading ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">불러오는 중...</div>
        ) : seasonData.error ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">데이터가 없습니다.</div>
        ) : seasonData.stats ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 스탯 테이블 */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {selected === 'total' ? '통산 스탯' : `${selected} 대회 스탯`}
                </h2>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {TABLE_ROWS.map(({ label, key }, i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-50 dark:bg-zinc-900'}>
                      <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                        {key === 'rating'
                          ? (seasonData.stats![key] as number).toFixed(2)
                          : seasonData.stats![key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 레이더 차트 */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                퍼포먼스 차트
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={buildRadarData(seasonData.stats)}>
                  <PolarGrid stroke="#e4e4e7" />
                  <PolarAngleAxis
                    dataKey="label"
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#65a30d"
                    fill="#65a30d"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f4f4f5',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  )
}

function BigStat({ label, value, accent }: {
  label: string; value: string | number; accent?: 'lime' | 'teal' | 'amber'
}) {
  const colorMap = {
    lime:  'text-lime-700 dark:text-lime-400',
    teal:  'text-teal-700 dark:text-teal-400',
    amber: 'text-amber-700 dark:text-amber-400',
  }
  const valueColor = accent ? colorMap[accent] : 'text-zinc-900 dark:text-zinc-100'
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}