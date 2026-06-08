import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
 
export default function Layout() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
 
          {/* 상단 헤더: 햄버거 버튼 + 로고 + 토글 버튼들 */}
          <div className="sticky top-0 z-50">
            <Header />
          </div>
 
          {/* 오버레이 사이드바 */}
          <Sidebar />
 
          {/* 메인 콘텐츠 */}
          <div className="flex flex-1 max-w-7xl mx-auto w-full">
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
 
          {/* 하단 푸터 */}
          <Footer />
 
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}