<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMetricsStore } from '@/stores/metrics'
import { useTasksStore } from '@/stores/tasks'
import AppLayout from '@/components/ui/AppLayout.vue'
import MetricCard from '@/components/tasks/MetricCard.vue'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const metricsStore = useMetricsStore()
const tasksStore = useTasksStore()

// Agrupa tarefas por categoria para o breakdown
const tasksByCategory = computed(() => {
  const map = new Map<string, { name: string; total: number; completed: number }>()

  for (const task of tasksStore.tasks) {
    const key = task.categoryId ?? '__none__'
    const name = task.category?.name ?? 'Sem categoria'
    if (!map.has(key)) map.set(key, { name, total: 0, completed: 0 })
    const entry = map.get(key)!
    entry.total++
    if (task.status === 'COMPLETED') entry.completed++
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
})

// Últimas 5 tarefas atualizadas
const recentTasks = computed(() =>
  [...tasksStore.tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5),
)

onMounted(() => {
  metricsStore.fetchMetrics()
  if (tasksStore.tasks.length === 0) tasksStore.fetchTasks()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- Título -->
      <div>
        <h1 class="text-xl font-bold text-gray-900">Relatórios</h1>
        <p class="mt-1 text-sm text-gray-500">Visão geral do progresso das suas tarefas</p>
      </div>

      <!-- Cards de métricas -->
      <section>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Resumo</h2>
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
      </section>

      <!-- Tarefas por categoria -->
      <section>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Por categoria</h2>
        <div v-if="tasksStore.tasks.length > 0" class="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div
            v-for="cat in tasksByCategory"
            :key="cat.name"
            class="flex items-center gap-3 border-b border-gray-50 px-3 py-3.5 last:border-0 sm:gap-4 sm:px-5"
          >
            <span class="w-24 shrink-0 truncate text-sm font-medium text-gray-700 sm:w-36">{{ cat.name }}</span>
            <div class="flex-1">
              <div class="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-2 rounded-full bg-blue-500 transition-all duration-500"
                  :style="{ width: cat.total > 0 ? `${(cat.completed / cat.total) * 100}%` : '0%' }"
                />
              </div>
            </div>
            <span class="w-16 shrink-0 text-right text-xs text-gray-400 sm:w-20">
              {{ cat.completed }}/{{ cat.total }} concluídas
            </span>
          </div>
        </div>
        <div v-else class="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center">
          <p class="text-sm text-gray-400">Nenhuma tarefa para exibir</p>
        </div>
      </section>

      <!-- Atividade recente -->
      <section>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Atividade recente</h2>
        <div v-if="recentTasks.length > 0" class="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center gap-3 border-b border-gray-50 px-3 py-3.5 last:border-0 sm:px-5"
          >
            <AppIcon name="ClipboardCheckIcon" class="size-4 shrink-0 text-gray-300" />
            <div class="flex-1 min-w-0">
              <p class="truncate text-sm font-medium text-gray-800">{{ task.title }}</p>
              <p v-if="task.category" class="text-xs text-gray-400">{{ task.category.name }}</p>
            </div>
            <TaskStatusBadge :status="task.status" />
          </div>
        </div>
        <div v-else class="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center">
          <p class="text-sm text-gray-400">Nenhuma atividade recente</p>
        </div>
      </section>
    </div>
  </AppLayout>
</template>
