import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="h-screen bg-background text-foreground flex flex-col items-center">
        {/* 상단 헤더: 로고 + 다크모드 토글 */}
        <div className="w-full border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto">
            <Header />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden w-full">
          {/* 중앙 정렬 컨테이너 */}
          <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}