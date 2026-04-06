import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { setAuthToken, clearAuthToken } from '@/lib/api'
import type { User, AuthUser, LoginPayload, RegisterPayload } from '@/types/auth'

const TOKEN_KEY = 'auth_token'

function decodeTokenId(token: string): string | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const payload = JSON.parse(atob(part))
    return payload.sub ?? null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const user = ref<AuthUser | null>(
    token.value ? { id: decodeTokenId(token.value) ?? '' } : null,
  )

  const isLoggedIn = computed(() => token.value !== null)

  if (token.value) {
    setAuthToken(token.value)
  }

  async function login(payload: LoginPayload) {
    const response = await authService.login(payload)
    token.value = response.token
    localStorage.setItem(TOKEN_KEY, response.token)
    setAuthToken(response.token)
    user.value = { id: decodeTokenId(response.token) ?? '' }
  }

  async function register(payload: RegisterPayload) {
    await userService.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
    clearAuthToken()
  }

  return { user, token, isLoggedIn, login, register, logout }
})
