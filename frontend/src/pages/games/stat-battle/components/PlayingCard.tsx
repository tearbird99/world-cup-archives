import { useTranslation } from 'react-i18next'
import type { PlayerSummary } from '../../../players/PlayerCard'
import { BATTLE_STATS } from '../constants'
import type { BattleStatKey, Owner } from '../types'
import StatRow from './StatRow'

interface PlayingCardProps {
  player: PlayerSummary
  owner: Owner
  revealedStat: BattleStatKey | null
  roundWinner: Owner | 'tie' | null
  pickable: boolean
  onSelectStat: (key: BattleStatKey) => void
}

export default function PlayingCard({
  player,
  owner,
  revealedStat,
  roundWinner,
  pickable,
  onSelectStat,
}: PlayingCardProps) {
  const { t } = useTranslation('games')

  const flagUrl = player.nationality_code
    ? `https://flagcdn.com/w40/${player.nationality_code.toLowerCase()}.png`
    : null

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-sm border
        bg-[#f7f1e2] border-[#e3d6b3]
        bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.045)_1px,transparent_0)] bg-[length:3px_3px]
        dark:bg-[#2b2620] dark:border-[#46402f]
        dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.035)_1px,transparent_0)]"
    >
      <div className="flex items-center gap-2 p-3 border-b border-[#b49a62]/35 dark:border-[#b49a62]/20">
        <img
          src={`/players/${player.id}.webp`}
          alt={player.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            const target = e.currentTarget
            target.onerror = null
            target.src = '/players/default.webp'
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">{player.name}</p>
          <div className="flex items-center gap-1">
            {flagUrl && <img src={flagUrl} alt={player.nationality} className="h-3 rounded-sm" />}
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{player.position}</span>
          </div>
        </div>
      </div>

      <div>
        {BATTLE_STATS.map((stat) => {
          const isRevealedRow = revealedStat === stat.key
          // 상대(cpu) 카드 '?'로 표시
          const hidden = owner === 'cpu' && !isRevealedRow
          const highlight: 'none' | 'win' | 'lose' | 'tie' = !isRevealedRow
            ? 'none'
            : roundWinner === 'tie'
              ? 'tie'
              : roundWinner === owner
                ? 'win'
                : 'lose'

          return (
            <StatRow
              key={stat.key}
              label={t(`statBattle.${stat.labelKey}`)}
              statKey={stat.key}
              value={player[stat.key]}
              hidden={hidden}
              pickable={pickable && !revealedStat}
              highlight={highlight}
              onSelect={() => onSelectStat(stat.key)}
            />
          )
        })}
      </div>
    </div>
  )
}