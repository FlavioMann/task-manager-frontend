<script setup lang="ts">
import { onMounted } from 'vue'
import { useMetricsStore } from '@/stores/metrics'
import MetricCard from '@/components/tasks/MetricCard.vue'

const metricsStore = useMetricsStore()

onMounted(() => metricsStore.fetchMetrics())
</script>

<template>
  <div v-if="metricsStore.metrics" class="grid grid-cols-2 gap-3 md:grid-cols-5">
    <MetricCard label="Total" :value="metricsStore.metrics.totalTasks" color="gray" />
    <MetricCard label="Pendentes" :value="metricsStore.metrics.pendingTasks" color="yellow" />
    <MetricCard label="Em andamento" :value="metricsStore.metrics.inProgressTasks" color="purple" />
    <MetricCard label="Concluídas" :value="metricsStore.metrics.completedTasks" color="green" />
    <MetricCard
      class="col-span-2 md:col-span-1"
      label="Progresso"
      :value="metricsStore.metrics.progressPercentage"
      color="blue"
      :progress="metricsStore.metrics.progressPercentage"
    />
  </div>

  <div v-else class="grid grid-cols-2 gap-3 md:grid-cols-5">
    <div v-for="i in 4" :key="i" class="h-20 rounded-xl bg-gray-100 animate-pulse" />
    <div class="col-span-2 h-20 rounded-xl bg-gray-100 animate-pulse md:col-span-1" />
  </div>
</template>

