import { describe, it, expect, beforeEach } from 'vitest'

describe('lib/api', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('cria instância axios com baseURL do env', async () => {
    const { api } = await import('@/lib/api')
    expect(api.defaults.baseURL).toBeDefined()
  })

  it('setAuthToken define header Authorization', async () => {
    const { api, setAuthToken } = await import('@/lib/api')
    setAuthToken('meu-token-jwt')
    expect(api.defaults.headers.common['Authorization']).toBe('Bearer meu-token-jwt')
  })

  it('clearAuthToken remove header Authorization', async () => {
    const { api, setAuthToken, clearAuthToken } = await import('@/lib/api')
    setAuthToken('meu-token-jwt')
    clearAuthToken()
    expect(api.defaults.headers.common['Authorization']).toBeUndefined()
  })
})
