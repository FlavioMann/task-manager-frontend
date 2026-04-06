<script setup lang="ts">
import type { TaskStatus } from '@/types/task'

defineProps<{ status: TaskStatus }>()

const config: Record<TaskStatus, { label: string; classes: string }> = {
  PENDING: { label: 'Pendente', classes: 'bg-yellow-100 text-yellow-700' },
  IN_PROGRESS: { label: 'Em andamento', classes: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Concluída', classes: 'bg-green-100 text-green-700' },
}
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config[status].classes]"
  >
    {{ config[status].label }}
  </span>
</template>
