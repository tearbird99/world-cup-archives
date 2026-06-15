import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import Home from '@/pages/home/Home'
import Players from '@/pages/players/Players'
import Teams from '@/pages/teams/Teams'
import Records from '@/pages/records/Records'
import History from '@/pages/history/History'
import Stats from '@/pages/stats/Stats'
import Games from '@/pages/games/Games'
import PlayerDetail from '@/pages/players/PlayerDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="players" element={<Players />} />
        <Route path="teams" element={<Teams />} />
        <Route path="records" element={<Records />} />
        <Route path="history" element={<History />} />
        <Route path="games" element={<Games />} />
        <Route path="stats" element={<Stats />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
      </Route>
    </Routes>
  )
}