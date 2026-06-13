import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { TEST_PLAYERS } from '@/components/players/playersData'

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('players')
  const navigate = useNavigate()

  const idx = TEST_PLAYERS.findIndex((p) => p.id === Number(id))
  const player = TEST_PLAYERS[idx]

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-zinc-500">{t('no_results')}</p>
        <Link to="/players" className="text-lime-600 hover:underline text-sm">
          ← {t('title')}
        </Link>
      </div>
    )
  }

  const flagUrl = player.nationality_code
    ? `https://flagcdn.com/w80/${player.nationality_code.toLowerCase()}.png`
    : null

  return (
    <div className="min-h-screen">
      {/* ── 본문 ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 뒤로 가기 */}
        <Link
          to="/players"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-lime-600 dark:hover:text-lime-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('title')}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* 왼쪽: 사진 + 기본 정보 */}
          <div>
            {/* 선수 사진 카드 */}
            <div
              className="rounded-2xl overflow-hidden flex items-center justify-center h-72 mb-4 relative"
              style={{ backgroundColor: player.team_color_primary + '20' }}
            >
              {flagUrl && (
                <img
                  src={flagUrl}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover opacity-5 scale-110 blur-sm"
                />
              )}
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

            {/* 기본 정보 테이블 */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <InfoRow label="국적">
                <div className="flex items-center gap-2">
                  {flagUrl && (
                    <img src={flagUrl} alt={player.nationality} className="h-4 rounded-sm" />
                  )}
                  <span>{player.nationality}</span>
                </div>
              </InfoRow>
              <InfoRow label={t('detail_tournaments')}>
                <div className="flex flex-wrap gap-1">
                  {player.seasons_played.map((yr) => (
                    <span key={yr} className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                      {yr}
                    </span>
                  ))}
                </div>
              </InfoRow>
              <InfoRow label={t('card_rating')}>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {player.career_rating?.toFixed(2) ?? '—'}
                </span>
              </InfoRow>
            </div>
          </div>

          {/* 오른쪽: 스탯 */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {player.name}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                {player.nationality}
              </p>
            </div>

            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {t('detail_career')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <BigStat label={t('card_appearances')} value={player.appearances} />
              <BigStat label={t('card_goals')} value={player.goals} accent="lime" />
              <BigStat label={t('card_assists')} value={player.assists} accent="teal" />
              <BigStat label={t('card_rating')} value={player.career_rating?.toFixed(2) ?? '—'} accent="amber" />
            </div>

            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center text-zinc-400 text-sm">
              ...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-zinc-200 dark:border-zinc-800">
      <span className="text-xs text-zinc-500 dark:text-zinc-400 w-20 shrink-0">{label}</span>
      <span className="text-sm text-zinc-900 dark:text-zinc-100">{children}</span>
    </div>
  )
}

function BigStat({ label, value, accent }: { label: string; value: string | number; accent?: 'lime' | 'teal' | 'amber' }) {
  const colorMap = {
    lime: 'text-lime-700 dark:text-lime-400',
    teal: 'text-teal-700 dark:text-teal-400',
    amber: 'text-amber-700 dark:text-amber-400',
  }
  const valueColor = accent ? colorMap[accent] : 'text-zinc-900 dark:text-zinc-100'
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}