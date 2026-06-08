import { Moon, Sun, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { i18n } = useTranslation()

  // 언어 토글 함수
  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'ko' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('language', next)
  }

  return (
    <header className="h-14 flex items-center px-6 gap-4">
      {/* 로고: 트로피 아이콘 + "World Cup Archives" 텍스트 */}
      <div className="flex items-center gap-2.5">
        <Trophy className="w-5 h-5 text-primary" />
        <span className="font-bold text-base tracking-tight">
          World Cup <span className="text-primary">Archives</span>
        </span>
      </div>

      {/* 가운데 공백: 로고와 토글 버튼을 양끝으로 밀어냄 */}
      <div className="flex-1" />

      {/* 언어 토글 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground"
        aria-label="언어 전환"
      >
        {i18n.language === 'en' ? 'KO' : 'EN'}
      </Button>

      {/* 다크/라이트 모드 토글 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="테마 전환"
      >
        {theme === 'dark'
          ? <Sun className="w-4 h-4" />
          : <Moon className="w-4 h-4" />
        }
      </Button>
    </header>
  )
}