import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">

        {/* 상단 헤더: 로고 + 다크모드 토글 */}
        <div className="sticky top-0 z-50">
          <Header />
        </div>

        {/* 바디: 사이드바 + 메인 콘텐츠 */}
        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>

      </div>
    </ThemeProvider>
  )
}