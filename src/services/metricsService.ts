import { api } from '@/lib/api'
import type { Metrics } from '@/types/task'

export const metricsService = {
  async get(): Promise<Metrics> {
    const { data } = await api.get<Metrics>('/metrics')
    return data
  },
}
