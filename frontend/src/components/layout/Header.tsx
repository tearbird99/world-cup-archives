import { Moon, Sun, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { i18n } = useTranslation()

  const isDark = theme === 'dark'

  // 언어 토글 함수
  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'ko' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('language', next)
  }

  return (
    <header
      className="h-14 flex items-center gap-4"
      style={{
        backgroundColor: theme === 'dark'
          ? 'oklch(0.768 0.233 130.85)'   /* lime-500 — 다크 모드 */
          : 'oklch(0.453 0.124 130.933)', /* lime-800 — 라이트 모드 */
      }}
    >
      {/* 로고: 트로피 아이콘 + "World Cup Archives" 텍스트 */}
      <div className="max-w-7xl mx-auto w-full flex items-center gap-4 px-6">
        {/* 로고 */}
        <div className="flex items-center gap-2.5">
          <Trophy className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} />
          <span className={`font-bold text-base tracking-tight ${isDark ? 'text-black' : 'text-white'}`}>
            World Cup <span className={isDark ? 'text-black/60' : 'text-white/80'}>Archives</span>
          </span>
        </div>
        {/* 가운데 공백: 로고와 토글 버튼을 양끝으로 밀어냄 */}
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
              backgroundImage: `url('/node_modules/flag-icons/flags/4x3/${i18n.language === 'en' ? 'gb' : 'kr'}.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* 어두운 오버레이 */}
          <span className="absolute inset-0 w-full h-full bg-black/40" />
          {/* 텍스트 */}
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
          {isDark
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </Button>
      </div>
    </header>
  )
}