import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Users,
  Shield,
  Medal,
  BookOpen,
  Gamepad2,
  BarChart2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/contexts/SidebarContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function Sidebar() {
  const { t } = useTranslation('nav')
  const { isOpen, close } = useSidebar()
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  // 헤더와 동일한 lime 배경색
  const sidebarBg = isDark
    ? 'oklch(0.768 0.233 130.85)'   // lime-500 — 다크 모드
    : 'oklch(0.453 0.124 130.933)'  // lime-800 — 라이트 모드

  // 메인 네비게이션 항목
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('home') },
    { to: '/players', icon: Users, label: t('players') },
    { to: '/teams', icon: Shield, label: t('teams') },
    { to: '/records', icon: Medal, label: t('records') },
    { to: '/history', icon: BookOpen, label: t('history') },
    { to: '/stats', icon: BarChart2, label: t('stats') },
  ]

  const extraItems = [
    { to: '/games', icon: Gamepad2, label: t('games') },
  ]

  // NavLink 스타일: lime 배경 위이므로 텍스트 색상을 맞춰서 조정
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
      isDark
        ? isActive
          ? 'bg-black/20 text-black font-medium'
          : 'text-black/70 hover:text-black hover:bg-black/10'
        : isActive
          ? 'bg-white/20 text-white font-medium'
          : 'text-white/70 hover:text-white hover:bg-white/20'
    )

  return (
    <>
      {/* 딤 오버레이 — 사이드바 바깥 영역 클릭 시 닫힘 */}
      <div
        className={cn(
          'fixed inset-0 z-60 bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* 사이드바 패널 */}
      <aside
        className={cn(
          // 위치 & 크기
          'fixed top-0 left-0 z-70 h-full w-64',
          // 슬라이드 애니메이션
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // 스크롤
          'flex flex-col overflow-y-auto'
        )}
        style={{ backgroundColor: sidebarBg }}
      >
        {/* 사이드바 헤더: 닫기 버튼 */}
        <div className="flex items-center justify-end h-14 px-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className={isDark
              ? 'text-black hover:text-black hover:bg-black/10'
              : 'text-white hover:text-white hover:bg-white/20'
            }
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 메인 네비게이션 */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={linkClass}
              onClick={close}   // 링크 클릭 시 사이드바 닫기
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* 구분선 */}
        <div className="px-3 my-3">
          <Separator className={isDark ? 'bg-black/20' : 'bg-white/20'} />
        </div>

        {/* 기타 네비게이션 */}
        <nav className="flex flex-col gap-1 px-3">
          {extraItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
              onClick={close}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}