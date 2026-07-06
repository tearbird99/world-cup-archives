import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  type Favorite,
  type TargetType,
} from '@/lib/favorites'

interface FavoritesContextValue {
  favorites: Favorite[]
  isLoading: boolean
  isFavorited: (targetType: TargetType, targetId: string) => boolean
  toggleFavorite: (targetType: TargetType, targetId: string) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 로그인 상태가 바뀔 때마다 즐겨찾기 목록 동기화
  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites([])
      return
    }
    setIsLoading(true)
    fetchFavorites()
      .then(setFavorites)
      .finally(() => setIsLoading(false))
  }, [isLoggedIn])

  function isFavorited(targetType: TargetType, targetId: string) {
    return favorites.some(
      (f) => f.target_type === targetType && f.target_id === targetId,
    )
  }

  async function toggleFavorite(targetType: TargetType, targetId: string) {
    if (!isLoggedIn) return

    const already = isFavorited(targetType, targetId)

    if (already) {
      // 낙관적 업데이트: UI 먼저 반영 후 서버 요청
      setFavorites((prev) =>
        prev.filter(
          (f) => !(f.target_type === targetType && f.target_id === targetId),
        ),
      )
      try {
        await removeFavorite(targetType, targetId)
      } catch {
        // 실패 시 롤백을 위해 목록 재조회
        fetchFavorites().then(setFavorites)
      }
    } else {
      try {
        const created = await addFavorite(targetType, targetId)
        setFavorites((prev) => [created, ...prev])
      } catch {
        // 실패 시 조용히 무시 (409 중복 등) - 필요 시 토스트 알림 추가 가능
      }
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoading, isFavorited, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites는 FavoritesProvider 내부에서만 사용할 수 있습니다.')
  }
  return context
}