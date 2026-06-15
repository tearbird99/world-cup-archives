interface BigStatProps {
  label: string
  value: string | number
  accent?: 'lime' | 'teal' | 'amber'
}

export default function BigStat({ label, value, accent }: BigStatProps) {
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