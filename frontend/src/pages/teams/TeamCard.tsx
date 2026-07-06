import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { TeamSummary } from './teamsData'
import { StarButton } from '@/components/ui/StarButton'

interface TeamCardProps {
  team: TeamSummary
}

export default function TeamCard({ team }: TeamCardProps) {
  const { i18n } = useTranslation()
  const isKo = i18n.language === 'ko'

  const flagUrl = `/teams/${team.country_code}.webp`

  return (
    <div className="relative group">
      {/* 즐겨찾기 별표 — 국기 이미지 위 우측 상단, 가독성을 위해 반투명 배경 */}
      <div className="absolute top-2 right-2 z-10 rounded-full bg-black/30 backdrop-blur-sm">
        <StarButton targetType="team" targetId={String(team.id)} size="sm" variant="overlay" />
      </div>

      <Link
        to={`/teams/${team.id}`}
        className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-200"
      >
        {/* 국기 영역 */}
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <img
            src={flagUrl}
            alt={team.name}
            className="absolute inset-0 w-full h-full object-cover"
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
            <div className="flex flex-wrap gap-1">
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
        </div>
      </Link>
    </div>
  )
}