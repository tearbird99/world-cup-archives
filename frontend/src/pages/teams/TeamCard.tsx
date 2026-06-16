import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { TeamSummary } from './teamsData'

interface TeamCardProps {
  team: TeamSummary
}

export default function TeamCard({ team }: TeamCardProps) {
  const { i18n } = useTranslation()
  const isKo = i18n.language === 'ko'

  const flagUrl = `/teams/${team.country_code}.webp`

  return (
    <Link
      to={`/teams/${team.id}`}
      className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-200"
    >
      {/* 국기 영역 */}
      <div className="relative flex items-center justify-center h-36 overflow-hidden">
        <img
          src={flagUrl}
          alt={team.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* 정보 영역 */}
      <div className="p-3">
        {/* 국명 */}
        <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight mb-2.5 group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors">
          {isKo ? team.name_ko : team.name}
        </p>

        {/* 출전 횟수 */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">출전</span>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{team.appearances}회</span>
        </div>

        {/* 우승 연도 */}
        {team.titles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {team.titles.map((yr) => (
              <span
                key={yr}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-semibold"
              >
                {yr}
              </span>
            ))}
          </div>
        )}

        {/* 준우승 연도 */}
        {team.runner_ups.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {team.runner_ups.map((yr) => (
              <span
                key={yr}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                {yr}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}