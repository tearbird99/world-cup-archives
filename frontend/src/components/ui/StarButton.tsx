import type { MouseEvent } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useToast } from '@/contexts/ToastContext'
import type { TargetType } from '@/lib/favorites'

interface StarButtonProps {
  targetType: TargetType
  targetId: string
  size?: 'sm' | 'md'
  /**
   * 'default': 흰 배경 위 (상세 페이지 헤더 등) - 은은한 회색 아웃라인
   * 'overlay': 사진/이미지 위에 얹히는 경우 (카드) - 흰색 아웃라인 + 어두운 배경으로 대비 확보
   */
  variant?: 'default' | 'overlay'
  className?: string
}

/**
 * 즐겨찾기 별표 버튼.
 * - 비로그인 상태에서도 항상 표시되지만, 클릭 시 토글되지 않고 로그인 안내 토스트만 뜸
 * - 로그인 상태에서는 즐겨찾기 추가/삭제 토글
 */
export function StarButton({
  targetType,
  targetId,
  size = 'md',
  variant = 'default',
  className = '',
}: StarButtonProps) {
  const { isLoggedIn } = useAuth()
  const { isFavorited, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const favorited = isLoggedIn && isFavorited(targetType, targetId)
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      showToast('즐겨찾기를 사용하려면 로그인이 필요합니다.')
      return
    }

    toggleFavorite(targetType, targetId)
  }

  const unfavoritedColor =
    variant === 'overlay'
      ? 'fill-transparent text-white/90 hover:text-lime-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
      : 'fill-transparent text-neutral-400 hover:text-lime-500'

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      aria-pressed={favorited}
      className={`inline-flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-lime-500/10 ${className}`}
    >
      <Star
        className={`${iconSize} transition-colors ${
          favorited ? 'fill-lime-500 text-lime-500' : unfavoritedColor
        }`}
      />
    </button>
  )
}