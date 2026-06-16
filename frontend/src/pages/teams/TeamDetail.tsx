import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { TEAMS } from './teamsData'

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const team = TEAMS.find((t) => t.id === Number(id))

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center text-zinc-400">
        팀을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link
        to="/teams"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        팀 목록
      </Link>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {team.name}
      </h1>
      <p className="text-zinc-400 mt-2">준비 중입니다.</p>
    </div>
  )
}