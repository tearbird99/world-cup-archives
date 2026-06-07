import { Moon, Sun, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

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

      {/* 다크/라이트 모드 토글 버튼
          - 다크 모드일 때: Sun 아이콘 (라이트로 전환 유도)
          - 라이트 모드일 때: Moon 아이콘 (다크로 전환 유도) */}
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