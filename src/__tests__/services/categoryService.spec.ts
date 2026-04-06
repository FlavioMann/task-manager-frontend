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

describe('categoryService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('create faz POST /categories e retorna categoryId', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.post).mockResolvedValue({ data: { categoryId: 'cat-123' } })
    const { categoryService } = await import('@/services/categoryService')
    const result = await categoryService.create('Trabalho')
    expect(api.post).toHaveBeenCalledWith('/categories', { name: 'Trabalho' })
    expect(result.categoryId).toBe('cat-123')
  })
})
