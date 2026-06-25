import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { TEAMS } from '@/pages/teams/teamsData'
import type { StatMode, YearTab } from './types'
import { getMaxMaps } from './constants'
import { useTeamYears } from './hooks/useTeamYears'
import { useTeamStats } from './hooks/useTeamStats'
import BigStat from './components/BigStat'
import ModeToggle from './components/ModeToggle'
import StatTable from './components/StatTable'
import RadarGroup from './components/RadarGroup'

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('teams')
  const team = TEAMS.find((tm) => tm.id === Number(id))

  const [selected, setSelected] = useState<YearTab | null>(null)
  const [statMode, setStatMode] = useState<StatMode>('total')

  // 출전 연도 목록은 백엔드(/api/teams/{team_id})에서 가져옴 — data/teams/ 폴더를
  // 스캔해서 실제로 통계 파일이 존재하는 연도만 내려주므로 teamsData.ts에는 저장하지 않는다.
  const yearsData = useTeamYears(team?.id ?? 0)

  // 연도 목록이 로드되면 아직 선택된 연도가 없을 때 가장 최근 연도를 기본 선택
  useEffect(() => {
    if (selected === null && yearsData.years.length > 0) {
      setSelected(yearsData.years[yearsData.years.length - 1])
    }
  }, [yearsData.years, selected])

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-zinc-500">{t('no_results')}</p>
        <Link to="/teams" className="text-lime-600 hover:underline text-sm">← {t('title')}</Link>
      </div>
    )
  }

  const tabs = yearsData.years
  const activeYear = selected ?? tabs[tabs.length - 1] ?? null

  const seasonData = useTeamStats(team.id, activeYear ?? 0)

  const flagUrl = `/teams/${team.country_code}.webp`

  const maxMaps = getMaxMaps(statMode)
  const s = seasonData.stats
  const matches = s?.matches ?? 0

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">

        <Link to="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-lime-600 dark:hover:text-lime-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />{t('title')}
        </Link>

        {/* 상단: 국기 배경 + 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-10">
          <div className="self-start rounded-2xl overflow-hidden aspect-[3/2] w-full relative bg-zinc-100 dark:bg-zinc-900">
            <img src={flagUrl} alt={team.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>

          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{team.name}</h1>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 dark:text-zinc-400">{team.name_ko}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <BigStat label={t('card_appearances')} value={team.appearances} />
              <BigStat label={t('card_titles')}      value={team.titles.length}     accent="lime" />
              <BigStat label={t('card_runner_ups')}  value={team.runner_ups.length} accent="teal" />
              <BigStat label={t('card_rating')}      value={s ? s.avgRating.toFixed(2) : '–'} accent="amber" />
            </div>
          </div>
        </div>

        {/* 연도 탭 + 모드 토글 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelected(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${activeYear === tab
                    ? 'bg-lime-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <ModeToggle mode={statMode} onChange={setStatMode} />
        </div>

        {/* 스탯 영역 */}
        {yearsData.loading ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">{t('detail.loading')}</div>
        ) : yearsData.error || tabs.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">{t('detail.no_data')}</div>
        ) : seasonData.loading ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">{t('detail.loading')}</div>
        ) : seasonData.error || !s ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">{t('detail.no_data')}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatTable s={s} mode={statMode} matches={matches} />
            <RadarGroup s={s} mode={statMode} matches={matches} maxMaps={maxMaps} />
          </div>
        )}
      </div>
    </div>
  )
}