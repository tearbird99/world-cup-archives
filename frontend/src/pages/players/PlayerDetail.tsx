import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { PLAYERS } from '@/pages/players/playersData'
import type { StatMode, YearTab } from './types'
import { getMaxMaps } from './constants'
import { usePlayerStats } from './hooks/usePlayerStats'
import BigStat from './components/BigStat'
import ModeToggle from './components/ModeToggle'
import StatTable from './components/StatTable'
import RadarGroup from './components/RadarGroup'

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('players')
  const player = PLAYERS.find((p) => p.id === Number(id))

  const [selected, setSelected] = useState<YearTab>('career')
  const [statMode, setStatMode] = useState<StatMode>('total')

  const seasonData = usePlayerStats(player?.id ?? 0, selected)

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-zinc-500">{t('no_results')}</p>
        <Link to="/players" className="text-lime-600 hover:underline text-sm">← {t('title')}</Link>
      </div>
    )
  }

  // 아이콘용 팀 국기
  const flagUrl = player.nationality_code
    ? `https://flagcdn.com/w80/${player.nationality_code.toLowerCase()}.png`
    : null

  // 배경용 팀 국기
  const teamFlagUrl = player.team_code
    ? `/teams/${player.team_code.toUpperCase()}.webp`
    : null

  const tabs: YearTab[] = [...player.seasons_played, 'career']
  const isCareer = selected === 'career'
  const maxMaps = getMaxMaps(statMode, isCareer)
  const s = seasonData.stats
  const min = s?.minutesPlayed ?? 0

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">

        <Link to="/players"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-lime-600 dark:hover:text-lime-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />{t('title')}
        </Link>

        {/* 상단: 사진 + 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-10">
          <div className="rounded-2xl overflow-hidden flex items-center justify-center h-72 relative"
            style={{ backgroundColor: player.team_color_primary + '20' }}>
            {teamFlagUrl && (
              <img src={teamFlagUrl} alt="" aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <img
              src={`/players/${player.id}.webp`}
              alt={player.name}
              className="relative z-10 h-full w-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/players/default.webp' }}
            />
          </div>

          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{player.name}</h1>
            <div className="flex items-center gap-2">
              {flagUrl && <img src={flagUrl} alt={player.nationality} className="h-5 rounded-sm" />}
              <span className="text-zinc-500 dark:text-zinc-400">{player.nationality}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <BigStat label={t('card_appearances')} value={player.appearances} />
              <BigStat label={t('card_goals')} value={player.goals} accent="lime" />
              <BigStat label={t('card_assists')} value={player.assists} accent="teal" />
              <BigStat label={t('card_rating')} value={player.career_rating.toFixed(2)} accent="amber" />
            </div>
          </div>
        </div>

        {/* 탭 + 모드 토글 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
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
                {tab === 'career' ? t('detail.career') : tab}
              </button>
            ))}
          </div>
          <ModeToggle mode={statMode} onChange={setStatMode} />
        </div>

        {/* 스탯 영역 */}
        {seasonData.loading ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">{t('detail.loading')}</div>
        ) : seasonData.error || !s ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">{t('detail.no_data')}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatTable s={s} mode={statMode} minutes={min} />
            <RadarGroup s={s} mode={statMode} minutes={min} maxMaps={maxMaps} />
          </div>
        )}
      </div>
    </div>
  )
}