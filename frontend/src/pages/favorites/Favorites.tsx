import { useState, type ReactNode } from 'react'
import { Star } from 'lucide-react'
import PlayerCard from '@/pages/players/PlayerCard'
import { PLAYERS } from '@/pages/players/playersData'
import TeamCard from '@/pages/teams/TeamCard'
import { TEAMS } from '@/pages/teams/teamsData'
import { useFavorites } from '@/contexts/FavoritesContext'

type Tab = 'players' | 'teams'

export default function Favorites() {
  const [tab, setTab] = useState<Tab>('players')
  const { favorites, isLoading } = useFavorites()

  const favoritedPlayerIds = new Set(
    favorites.filter((f) => f.target_type === 'player').map((f) => f.target_id),
  )
  const favoritedTeamIds = new Set(
    favorites.filter((f) => f.target_type === 'team').map((f) => f.target_id),
  )

  const favoritedPlayers = PLAYERS.filter((p) => favoritedPlayerIds.has(String(p.id)))
  const favoritedTeams = TEAMS.filter((tm) => favoritedTeamIds.has(String(tm.id)))

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">내 즐겨찾기</h1>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <TabButton active={tab === 'players'} onClick={() => setTab('players')}>
          선수 {favoritedPlayers.length > 0 && `(${favoritedPlayers.length})`}
        </TabButton>
        <TabButton active={tab === 'teams'} onClick={() => setTab('teams')}>
          팀 {favoritedTeams.length > 0 && `(${favoritedTeams.length})`}
        </TabButton>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">불러오는 중...</p>
      ) : tab === 'players' ? (
        favoritedPlayers.length === 0 ? (
          <EmptyState message="즐겨찾기한 선수가 없어요." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoritedPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )
      ) : favoritedTeams.length === 0 ? (
        <EmptyState message="즐겨찾기한 팀이 없어요." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritedTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
        active
          ? 'border-lime-500 text-lime-700 dark:text-lime-400'
          : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
      }`}
    >
      {children}
    </button>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-600">
      <Star className="w-10 h-10 mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  )
}