import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

describe('userService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('create faz POST /users com payload e retorna userId', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.post).mockResolvedValue({ data: { userId: 'user-abc' } })
    const { userService } = await import('@/services/userService')
    const result = await userService.create({
      name: 'Flavi',
      email: 'flavi@test.com',
      password: '123456',
    })
    expect(api.post).toHaveBeenCalledWith('/users', {
      name: 'Flavi',
      email: 'flavi@test.com',
      password: '123456',
    })
    expect(result.userId).toBe('user-abc')
  })
})
