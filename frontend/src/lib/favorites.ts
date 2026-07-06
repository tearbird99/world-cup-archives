import { getStoredToken } from '@/lib/auth'

export type TargetType = 'player' | 'team'

export interface Favorite {
  id: number
  target_type: TargetType
  target_id: string
}

function authHeaders(): HeadersInit {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchFavorites(): Promise<Favorite[]> {
  const res = await fetch('/api/favorites', { headers: authHeaders() })
  if (!res.ok) throw new Error('즐겨찾기 목록을 불러오지 못했습니다.')
  return res.json()
}

export async function addFavorite(
  targetType: TargetType,
  targetId: string,
): Promise<Favorite> {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ target_type: targetType, target_id: targetId }),
  })
  if (!res.ok) throw new Error('즐겨찾기 추가에 실패했습니다.')
  return res.json()
}

export async function removeFavorite(
  targetType: TargetType,
  targetId: string,
): Promise<void> {
  const res = await fetch(`/api/favorites/${targetType}/${targetId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok && res.status !== 404) {
    throw new Error('즐겨찾기 삭제에 실패했습니다.')
  }
}