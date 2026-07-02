import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * 로그인 상태에 따라
 * - 비로그인: 구글 로그인 버튼
 * - 로그인됨: 프로필 사진 + 이름 + 로그아웃 버튼
 * 을 보여주는 컴포넌트. Header에 배치해서 사용.
 */
export function GoogleLoginButton() {
  const { user, isLoggedIn, isLoading, loginWithGoogleToken, logout } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (isLoading) {
    return null // 로그인 상태 복원 중에는 깜빡임 방지를 위해 아무것도 안 보여줌
  }

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-2">
        {user.picture_url && (
          <img
            src={user.picture_url}
            alt={user.name}
            className="w-7 h-7 rounded-full"
            referrerPolicy="no-referrer" // 구글 프로필 이미지 403 방지
          />
        )}
        <span
          className={`text-sm font-medium hidden sm:inline ${
            isDark ? 'text-black' : 'text-white'
          }`}
        >
          {user.name}
        </span>
        <button
          onClick={logout}
          className={`text-xs font-semibold tracking-wider transition-colors ${
            isDark ? 'text-black/70 hover:text-black' : 'text-white/80 hover:text-white'
          }`}
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (!credentialResponse.credential) return
        loginWithGoogleToken(credentialResponse.credential).catch((err) => {
          console.error('구글 로그인 실패:', err)
        })
      }}
      onError={() => {
        console.error('구글 로그인 실패')
      }}
      size="medium"
      shape="pill"
      text="signin_with"
    />
  )
}