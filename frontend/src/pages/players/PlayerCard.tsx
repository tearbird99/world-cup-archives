import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export interface PlayerSummary {
  id: number
  name: string
  nationality: string
  nationality_code: string
  team_code: string
  team_color_primary: string
  seasons_played: number[]
  career_rating: number
  goals: number
  assists: number
  appearances: number
}

interface PlayerCardProps {
  player: PlayerSummary
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const { t } = useTranslation('players')

  // 국기 아이콘 — flagcdn
  const flagUrl = player.nationality_code
    ? `https://flagcdn.com/w40/${player.nationality_code.toLowerCase()}.png`
    : null

  // 배경 국기 이미지 — teams/*.webp
  const teamFlagUrl = player.team_code
    ? `/teams/${player.team_code.toUpperCase()}.webp`
    : null

  return (
    <Link
      to={`/players/${player.id}`}
      className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-200"
    >
      {/* 사진 영역 */}
      <div
        className="relative flex items-center justify-center h-44 overflow-hidden"
        style={{ backgroundColor: player.team_color_primary + '18' }}
      >
        {/* 배경 국기 워터마크 — teams/*.webp */}
        {teamFlagUrl && (
          <img
            src={teamFlagUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}

        {/* 선수 사진 */}
        <img
          src={`/players/${player.id}.webp`}
          alt={player.name}
          className="relative z-10 h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget
            target.onerror = null
            target.src = '/players/default.webp'
          }}
        />
      </div>

      {/* 정보 영역 */}
      <div className="p-3">
        {/* 국적 */}
        <div className="flex items-center gap-1.5 mb-1">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={player.nationality}
              className="h-3.5 rounded-sm"
            />
          )}
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {player.nationality}
          </span>
        </div>

        {/* 이름 */}
        <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight mb-2.5 group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors">
          {player.name}
        </p>

        {/* 스탯 4개: 출전 / 골 / 어시 / 평점 */}
        <div className="flex gap-1">
          <StatChip label={t('card_appearances')} value={player.appearances}
            color="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300" />
          <StatChip label={t('card_goals')} value={player.goals}
            color="bg-lime-50 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400" />
          <StatChip label={t('card_assists')} value={player.assists}
            color="bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400" />
          <StatChip label={t('card_rating')} value={player.career_rating.toFixed(2)}
            color="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" />
        </div>

        {/* 대회 연도 태그 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {player.seasons_played.map((yr) => (
            <span key={yr}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              {yr}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function StatChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`flex-1 rounded-md px-1 py-1 text-center ${color}`}>
      <div className="text-[9px] opacity-70 leading-none mb-0.5">{label}</div>
      <div className="text-xs font-bold leading-none">{value}</div>
    </div>
  )
}