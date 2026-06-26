import { Moon, Sun, Trophy, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { useSidebar } from '@/contexts/SidebarContext'
import gbFlag from 'flag-icons/flags/4x3/gb.svg?url'
import krFlag from 'flag-icons/flags/4x3/kr.svg?url'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { i18n } = useTranslation('nav')
  const { toggle } = useSidebar()

  const isDark = theme === 'dark'

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'ko' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('language', next)
  }

  const headerBg = isDark
    ? 'oklch(0.768 0.233 130.85)'   // lime-500 — 다크 모드
    : 'oklch(0.453 0.124 130.933)'  // lime-800 — 라이트 모드

  return (
    <header
      className="h-14 flex items-center"
      style={{ backgroundColor: headerBg }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center gap-4 px-6">

        {/* 햄버거 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={isDark
            ? 'text-black hover:text-black hover:bg-black/10'
            : 'text-white hover:text-white hover:bg-white/20'
          }
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* 로고: 클릭 시 홈으로 이동 */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        >
          <Trophy className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} />
          <span className={`font-bold text-base tracking-tight ${isDark ? 'text-black' : 'text-white'}`}>
            World Cup <span className={isDark ? 'text-black/60' : 'text-white/80'}>Archives</span>
          </span>
        </Link>

        <div className="flex-1" />

        {/* 언어 토글 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="relative overflow-hidden px-3 text-xs font-semibold tracking-wider text-white hover:text-white hover:bg-white/20"
          aria-label="언어 전환"
        >
          <span
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${i18n.language === 'en' ? gbFlag : krFlag})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <span className="absolute inset-0 w-full h-full bg-black/40" />
          <span className="relative z-10">
            {i18n.language === 'en' ? 'EN' : 'KO'}
          </span>
        </Button>

        {/* 다크/라이트 모드 토글 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={isDark
            ? 'text-black hover:text-black hover:bg-black/10'
            : 'text-white hover:text-white hover:bg-white/20'
          }
          aria-label="테마 전환"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

      </div>
    </header>
  )
}