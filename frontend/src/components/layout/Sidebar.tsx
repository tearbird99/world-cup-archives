import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Shield,
  Medal,
  BookOpen,
  Gamepad2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

/*
 * 메인 네비게이션 항목
 * - to: 라우트 경로
 * - icon: lucide-react 아이콘 컴포넌트
 * - label: 사이드바에 표시할 텍스트
 */
const navItems = [
  { to: '/',        icon: LayoutDashboard, label: 'Home' },
  { to: '/players', icon: Users,           label: 'Players' },
  { to: '/teams',   icon: Shield,          label: 'Teams' },
  { to: '/records', icon: Medal,           label: 'Records' },
  { to: '/history', icon: BookOpen,        label: 'History' },
]

// 게임/퀴즈처럼 메인 통계 페이지와 성격이 다른 항목을 분리
const extraItems = [
  { to: '/games', icon: Gamepad2, label: 'Games & Quiz' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 border-r border-border bg-background flex flex-col py-4 shrink-0">
      {/* 메인 네비게이션 */}
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}  // Home('/') 경로는 정확히 일치할 때만 활성 처리
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* 구분선: 메인 네비게이션 / 기타 항목 분리 */}
      <div className="px-3 my-3">
        <Separator />
      </div>

      {/* 기타 네비게이션 (게임/퀴즈) */}
      <nav className="flex flex-col gap-1 px-3">
        {extraItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}