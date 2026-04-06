import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockMetrics = {
  totalTasks: 10,
  completedTasks: 4,
  pendingTasks: 3,
  inProgressTasks: 3,
  progressPercentage: '40%',
  tasksByCategory: [],
}

vi.mock('@/services/metricsService', () => ({
  metricsService: {
    get: vi.fn().mockResolvedValue(mockMetrics),
  },
}))

describe('useMetricsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('inicia com metrics null e loading false', async () => {
    const { useMetricsStore } = await import('@/stores/metrics')
    const store = useMetricsStore()
    expect(store.metrics).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetchMetrics carrega dados e desativa loading', async () => {
    const { useMetricsStore } = await import('@/stores/metrics')
    const store = useMetricsStore()
    await store.fetchMetrics()
    expect(store.metrics).toEqual(mockMetrics)
    expect(store.loading).toBe(false)
  })

  it('fetchMetrics chama metricsService.get', async () => {
    const { useMetricsStore } = await import('@/stores/metrics')
    const { metricsService } = await import('@/services/metricsService')
    const store = useMetricsStore()
    await store.fetchMetrics()
    expect(metricsService.get).toHaveBeenCalledOnce()
  })

  it('desativa loading mesmo quando fetchMetrics lança erro', async () => {
    const { metricsService } = await import('@/services/metricsService')
    vi.mocked(metricsService.get).mockRejectedValueOnce(new Error('Erro de rede'))
    const { useMetricsStore } = await import('@/stores/metrics')
    const store = useMetricsStore()
    await expect(store.fetchMetrics()).rejects.toThrow('Erro de rede')
    expect(store.loading).toBe(false)
  })
})
