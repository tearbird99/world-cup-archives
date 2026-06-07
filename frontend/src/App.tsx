import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Players from '@/pages/Players'
import Teams from '@/pages/Teams'
import Records from '@/pages/Records'
import History from '@/pages/History'
import Games from '@/pages/Games'

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
      </Route>
    </Routes>
  )
}