import type { BattleStatKey } from '../types'
import { STAT_COLOR } from '../constants'
import { formatStat } from '../utils'

interface StatRowProps {
  label: string
  statKey: BattleStatKey
  value: number
  hidden: boolean
  pickable: boolean
  highlight: 'none' | 'win' | 'lose' | 'tie'
  onSelect: () => void
}

const HIGHLIGHT_CLASSES: Record<StatRowProps['highlight'], string> = {
  none: '',
  win: 'bg-emerald-50 dark:bg-emerald-900/20',
  lose: 'bg-rose-50 dark:bg-rose-900/20',
  tie: 'bg-amber-50 dark:bg-amber-900/20',
}

export default function StatRow({ label, statKey, value, hidden, pickable, highlight, onSelect }: StatRowProps) {
  const content = (
    <>
      {/* 가려진 값은 '?'로, 공개되면 실제 값으로 표시 */}
      <span className={`w-12 font-bold ${hidden ? 'text-zinc-300 dark:text-zinc-700' : STAT_COLOR[statKey]}`}>
        {hidden ? '?' : formatStat(statKey, value)}
      </span>
      <span className="flex-1 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      {/* 선택 가능한 스탯에만 라디오 버튼 모양 표시 */}
      {pickable && (
        <span className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600" aria-hidden="true" />
      )}
    </>
  )

  const baseClass = `flex items-center gap-2 px-3 py-2.5 border-b last:border-b-0 border-[#b49a62]/35 dark:border-[#b49a62]/20 ${HIGHLIGHT_CLASSES[highlight]}`

  // 선택 가능한 스탯
  if (pickable) {
    return (
      <button type="button" onClick={onSelect} className={`w-full text-left ${baseClass} hover:bg-black/5 dark:hover:bg-white/5`}>
        {content}
      </button>
    )
  }

  return <div className={baseClass}>{content}</div>
}