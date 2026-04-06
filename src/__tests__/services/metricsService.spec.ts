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

describe('metricsService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('get faz GET /metrics e retorna dados', async () => {
    const { api } = await import('@/lib/api')
    const mockMetrics = {
      totalTasks: 10,
      completedTasks: 4,
      pendingTasks: 3,
      inProgressTasks: 3,
      progressPercentage: '40%',
      tasksByCategory: [],
    }
    vi.mocked(api.get).mockResolvedValue({ data: mockMetrics })
    const { metricsService } = await import('@/services/metricsService')
    const result = await metricsService.get()
    expect(api.get).toHaveBeenCalledWith('/metrics')
    expect(result.totalTasks).toBe(10)
    expect(result.progressPercentage).toBe('40%')
  })
})
