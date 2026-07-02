// 인증 관련 API 호출 함수 및 타입 정의

export interface User {
  id: number;
  email: string;
  name: string;
  picture_url: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const TOKEN_STORAGE_KEY = "access_token";

/**
 * 구글 ID Token을 백엔드에 전달해서 로그인 처리.
 * 성공하면 access_token + user 정보를 반환.
 */
export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  const res = await fetch(`/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!res.ok) {
    throw new Error("구글 로그인에 실패했습니다.");
  }

  return res.json();
}

/**
 * 저장된 토큰으로 현재 로그인한 유저 정보를 조회.
 * 토큰이 없거나 만료됐으면 null 반환.
 */
export async function fetchCurrentUser(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;

  const res = await fetch(`/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    // 토큰이 만료/무효한 경우 - 로컬 저장값도 같이 정리
    clearStoredToken();
    return null;
  }

  return res.json();
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}