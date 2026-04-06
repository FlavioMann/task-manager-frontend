import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api', () => ({
  api: { post: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('login faz POST /sessions e retorna token', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.post).mockResolvedValue({ data: { token: 'jwt-token-123' } })
    const { authService } = await import('@/services/authService')
    const result = await authService.login({ email: 'a@a.com', password: '123456' })
    expect(api.post).toHaveBeenCalledWith('/sessions', { email: 'a@a.com', password: '123456' })
    expect(result.token).toBe('jwt-token-123')
  })
})
