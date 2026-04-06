import { defineStore } from 'pinia'
import { ref } from 'vue'
import { metricsService } from '@/services/metricsService'
import { useToastStore } from '@/stores/toast'
import type { Metrics } from '@/types/task'

export const useMetricsStore = defineStore('metrics', () => {
  const metrics = ref<Metrics | null>(null)
  const loading = ref(false)

  async function fetchMetrics() {
    loading.value = true
    try {
      metrics.value = await metricsService.get()
    } catch (error) {
      const toast = useToastStore()
      toast.error('Erro ao carregar métricas. Tente novamente.')
      throw error
    } finally {
      loading.value = false
    }
  }

  return { metrics, loading, fetchMetrics }
})
