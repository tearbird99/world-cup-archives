import { useCallback, useState } from 'react'
import type { PlayerSummary } from '../../../players/PlayerCard'
import { compareStat, dealDecks, pickStrongestStat } from '../utils'
import type { BattleState, BattleStatKey } from '../types'

// 새 게임/재시작 시 덱을 분배하고 초기 상태를 생성
function createInitialState(pool: PlayerSummary[]): BattleState {
  const { playerDeck, cpuDeck } = dealDecks(pool)
  return {
    playerDeck,
    cpuDeck,
    turn: 'player',
    revealedStat: null,
    roundWinner: null,
    isOver: false,
    gameWinner: null,
  }
}

export function useStatBattle(pool: PlayerSummary[]) {
  const [state, setState] = useState<BattleState>(() => createInitialState(pool))

  // 양쪽 맨 위 카드의 statKey 값을 비교해서 승자를 정하고 결과를 공개 상태로 전환
  const resolveStat = useCallback((statKey: BattleStatKey) => {
    setState((prev) => {
      if (prev.revealedStat || prev.isOver) return prev
      const playerCard = prev.playerDeck[0]
      const cpuCard = prev.cpuDeck[0]
      const roundWinner = compareStat(playerCard[statKey], cpuCard[statKey])
      return { ...prev, revealedStat: statKey, roundWinner }
    })
  }, [])

  // 플레이어 턴일 때만 호출 가능
  const pickStat = useCallback(
    (statKey: BattleStatKey) => {
      if (state.turn !== 'player') return
      resolveStat(statKey)
    },
    [state.turn, resolveStat]
  )

  // CPU 턴일 때 자동으로 호출되는 경로
  const cpuAutoPick = useCallback(() => {
    if (state.turn !== 'cpu' || state.revealedStat || state.isOver) return
    resolveStat(pickStrongestStat(state.cpuDeck[0]))
  }, [state.turn, state.revealedStat, state.isOver, state.cpuDeck, resolveStat])

  const nextRound = useCallback(() => {
    setState((prev) => {
      if (!prev.revealedStat || !prev.roundWinner) return prev
      const [playerTop, ...playerRest] = prev.playerDeck
      const [cpuTop, ...cpuRest] = prev.cpuDeck

      let playerDeck = playerRest
      let cpuDeck = cpuRest

      // 규칙: 이긴 쪽이 양쪽 카드를 모두 가져가 자기 덱 맨 뒤에 쌓음
      // 무승부면 각자 자기 카드를 그대로 자기 덱 맨 뒤로 돌려받음
      if (prev.roundWinner === 'player') {
        playerDeck = [...playerRest, playerTop, cpuTop]
      } else if (prev.roundWinner === 'cpu') {
        cpuDeck = [...cpuRest, cpuTop, playerTop]
      } else {
        playerDeck = [...playerRest, playerTop]
        cpuDeck = [...cpuRest, cpuTop]
      }

      // 한쪽 덱이 0장이 되면 게임 종료, 승자는 카드가 남아있는 쪽
      const isOver = playerDeck.length === 0 || cpuDeck.length === 0
      const gameWinner = !isOver
        ? null
        : playerDeck.length === 0 && cpuDeck.length === 0
          ? 'tie'
          : playerDeck.length === 0
            ? 'cpu'
            : 'player'

      return {
        playerDeck,
        cpuDeck,
        // 다음 라운드 선택권은 이번 라운드 승자에게 (무승부시 턴 유지)
        turn: prev.roundWinner === 'tie' ? prev.turn : prev.roundWinner,
        revealedStat: null,
        roundWinner: null,
        isOver,
        gameWinner,
      }
    })
  }, [])

  const restart = useCallback((newPool: PlayerSummary[]) => {
    setState(createInitialState(newPool))
  }, [])

  return { state, pickStat, cpuAutoPick, nextRound, restart }
}