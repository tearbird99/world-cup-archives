export interface GameConfig {
  id: string
  path: string
  nameKey: string
  descriptionKey: string
  status: 'available' | 'coming-soon'
}

// 게임 목록
export const GAMES: GameConfig[] = [
  {
    id: 'stat-battle',
    path: '/games/stat-battle',
    nameKey: 'statBattle.title',
    descriptionKey: 'statBattle.description',
    status: 'available',
  },
]