import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from '@/components/layout'
import Home from '@/pages/home/Home'
import Players from '@/pages/players/Players'
import Teams from '@/pages/teams/Teams'
import Records from '@/pages/records/Records'
import History from '@/pages/history/History'
import Stats from '@/pages/stats/Stats'
import Games from '@/pages/games/Games'
import PlayerDetail from '@/pages/players/PlayerDetail'
import TeamDetail from '@/pages/teams/TeamDetail'
import StatsDetail from '@/pages/stats/StatsDetail'
import StatBattlePage from '@/pages/games/stat-battle/StatBattlePage'
import Privacy from '@/pages/privacy/Privacy'
import Favorites from '@/pages/favorites/Favorites'
import { RequireAuth } from '@/components/auth/RequireAuth'

// 페이지 이동마다 스크롤바 항상 최상단
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="players" element={<Players />} />
          <Route path="teams" element={<Teams />} />
          <Route path="records" element={<Records />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="history" element={<History />} />
          <Route path="games" element={<Games />} />
          <Route path="stats" element={<Stats />} />
          <Route
            path="favorites"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/stats/:entity/:scope/:stat" element={<StatsDetail />} />
          <Route path="/games/stat-battle" element={<StatBattlePage />} />
        </Route>
      </Routes>
    </>
  )
}