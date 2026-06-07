import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* 상단 헤더: 로고 + 다크모드 토글 */}
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* 좌측 사이드바: 페이지 네비게이션 */}
          <Sidebar />

          {/* 메인 콘텐츠: 현재 라우트의 페이지가 렌더링되는 영역 */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}