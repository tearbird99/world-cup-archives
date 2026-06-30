import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PLAYERS } from '../../players/playersData'
import { useStatBattle } from './hooks/useStatBattle'
import PlayingCard from './components/PlayingCard'
import DeckPeek from './components/DeckPeek'

export default function StatBattlePage() {
  const { t } = useTranslation('games')
  const { state, pickStat, cpuAutoPick, nextRound, restart } = useStatBattle(PLAYERS)

  useEffect(() => {
    // CPU 턴이고 아직 스탯이 공개되지 않았다면, 0.9초 후 CPU가 자동으로 스탯을 고름
    if (state.turn === 'cpu' && !state.revealedStat && !state.isOver) {
      const timer = setTimeout(cpuAutoPick, 900)
      return () => clearTimeout(timer)
    }
  }, [state.turn, state.revealedStat, state.isOver, cpuAutoPick])

  // 양쪽 덱의 맨 위 카드 = 이번 라운드에서 비교할 카드
  const playerCard = state.playerDeck[0]
  const cpuCard = state.cpuDeck[0]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t('statBattle.title')}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{t('statBattle.description')}</p>

      {!state.isOver && playerCard && cpuCard && (
        <>
          <div className="flex items-center justify-center gap-4 mb-4">
            <DeckPeek count={state.playerDeck.length} side="left" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <PlayingCard
                player={playerCard}
                owner="player"
                revealedStat={state.revealedStat}
                roundWinner={state.roundWinner}
                pickable={state.turn === 'player'}
                onSelectStat={pickStat}
              />
              <PlayingCard
                player={cpuCard}
                owner="cpu"
                revealedStat={state.revealedStat}
                roundWinner={state.roundWinner}
                pickable={false}
                onSelectStat={() => {}}
              />
            </div>
            <DeckPeek count={state.cpuDeck.length} side="right" />
          </div>

          {/* 라운드 진행 상태 안내: 턴 안내 또는 결과(승/패/무) 메시지 */}
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 min-h-[20px] mb-3">
            {!state.revealedStat &&
              (state.turn === 'player' ? t('statBattle.yourTurn') : t('statBattle.cpuThinking'))}
            {state.revealedStat &&
              (state.roundWinner === 'tie'
                ? t('statBattle.roundTie')
                : state.roundWinner === 'player'
                  ? t('statBattle.roundWin')
                  : t('statBattle.roundLose'))}
          </div>

          {/* 스탯이 공개된 상태에서만 다음 라운드로 넘어갈 수 있음 */}
          {state.revealedStat && (
            <div className="text-center">
              <button
                type="button"
                onClick={nextRound}
                className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-600 text-zinc-900 text-sm font-bold transition-colors"
              >
                {t('statBattle.nextRound')}
              </button>
            </div>
          )}
        </>
      )}

      {/* 한쪽 덱이 0장이 되면 게임 종료 — 최종 결과와 다시하기 버튼 표시 */}
      {state.isOver && (
        <div className="text-center py-10">
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {state.gameWinner === 'tie'
              ? t('statBattle.gameOverTie')
              : state.gameWinner === 'player'
                ? t('statBattle.gameOverWin')
                : t('statBattle.gameOverLose')}
          </p>
          <button
            type="button"
            onClick={() => restart(PLAYERS)}
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-lime-500 dark:hover:border-lime-500 transition-colors"
          >
            {t('statBattle.restart')}
          </button>
        </div>
      )}
    </div>
  )
}