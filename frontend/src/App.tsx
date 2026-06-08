import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home, Players, Teams, Records, History, Games, Stats } from '@/pages'

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
      </Route>
    </Routes>
  )
}