interface DeckPeekProps {
  count: number
  side: 'left' | 'right'
}

export default function DeckPeek({ count, side }: DeckPeekProps) {
  return (
    <div className="relative hidden sm:block w-10 shrink-0">
      <div className="w-10 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      {/* 남은 카드 수 배지 — 카드와 겹치지 않게 좌/우 바깥쪽으로 위치 */}
      <div
        className={`absolute -top-2 w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center ${
          side === 'left' ? '-left-2' : '-right-2'
        }`}
      >
        {count}
      </div>
    </div>
  )
}