import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">

        {/* 상단 헤더: 로고 + 다크모드 토글 */}
        <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <Header />
          </div>
        </div>

        {/* 바디: 사이드바 + 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto flex">

          {/* 사이드바: 헤더 아래 고정 */}
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
            <Sidebar />
          </aside>

          {/* 메인 콘텐츠: 나머지 너비 전부 사용 */}
          <main className="flex-1 min-w-0 p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </ThemeProvider>
  )
}