import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// 테마 컨텍스트 기본값 (기본 테마: light)
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // localStorage에 저장된 테마가 있으면 사용, 없으면 기본값 'light'
    return (localStorage.getItem('theme') as Theme) ?? 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    // 기존 테마 클래스 제거 후 현재 테마 클래스 추가
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    // 선택한 테마를 localStorage에 저장
    localStorage.setItem('theme', theme)
  }, [theme])

  // 다크 ↔ 라이트 전환
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// useTheme 훅: 컴포넌트에서 현재 테마와 토글 함수에 접근할 때 사용
export const useTheme = () => useContext(ThemeContext)