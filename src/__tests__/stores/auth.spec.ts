import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ sub: 'user-123', iat: 0, exp: 9999999999 })) +
  '.signature'

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ token: FAKE_TOKEN }),
  },
}))

vi.mock('@/services/userService', () => ({
  userService: {
    create: vi.fn().mockResolvedValue({ userId: 'new-user-id' }),
  },
}))

vi.mock('@/lib/api', () => ({
  api: { post: vi.fn(), get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('inicia sem usuário logado quando não há token', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('realiza login e popula user com id do token', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    await auth.login({ email: 'test@test.com', password: '123456' })
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user?.id).toBe('user-123')
    expect(auth.token).toBe(FAKE_TOKEN)
  })

  it('persiste token no localStorage após login', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    await auth.login({ email: 'test@test.com', password: '123456' })
    expect(localStorage.getItem('auth_token')).toBe(FAKE_TOKEN)
  })

  it('logout limpa user, token e localStorage', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    await auth.login({ email: 'test@test.com', password: '123456' })
    auth.logout()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('register chama userService.create com os dados corretos', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const { userService } = await import('@/services/userService')
    const auth = useAuthStore()
    await auth.register({
      name: 'Flavi',
      email: 'flavi@test.com',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(userService.create).toHaveBeenCalledWith({
      name: 'Flavi',
      email: 'flavi@test.com',
      password: '123456',
    })
  })
})
