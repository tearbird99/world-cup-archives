import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/**
 * 로그인한 유저만 접근 가능한 라우트를 감싸는 가드.
 * 비로그인 상태면 홈으로 리다이렉트.
 * (isLoading 중엔 깜빡임 방지를 위해 아무것도 렌더링하지 않음)
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) return null
  if (!isLoggedIn) return <Navigate to="/" replace />

  return <>{children}</>
}