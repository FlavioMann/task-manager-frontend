<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import AppLayout from '@/components/ui/AppLayout.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import CreateTaskModal from '@/components/tasks/CreateTaskModal.vue'
import ShareTaskModal from '@/components/tasks/ShareTaskModal.vue'
import type { TaskStatus } from '@/types/task'

const auth = useAuthStore()
const tasksStore = useTasksStore()

const showCreateModal = ref(false)
const shareTaskId = ref<string | null>(null)
const activeFilter = ref<TaskStatus | 'ALL'>('ALL')

const filters: { value: TaskStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'COMPLETED', label: 'Concluídas' },
]

const filteredTasks = computed(() => {
  if (activeFilter.value === 'ALL') return tasksStore.tasks
  return tasksStore.tasks.filter((t) => t.status === activeFilter.value)
})

onMounted(() => tasksStore.fetchTasks())
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Tasks header -->
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900">Minhas tarefas</h1>
        <BaseButton @click="showCreateModal = true">
          <AppIcon name="PlusIcon" class="size-4" />
          Nova tarefa
        </BaseButton>
      </div>

      <!-- Filter tabs -->
      <div class="flex w-full overflow-x-auto rounded-lg bg-gray-100 p-1 sm:w-fit">
        <button
          v-for="f in filters"
          :key="f.value"
          :class="[
            'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition',
            activeFilter === f.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="tasksStore.loading" class="grid gap-4 sm:grid-cols-2">
        <div v-for="i in 4" :key="i" class="h-36 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <!-- Tasks grid -->
      <div v-else-if="filteredTasks.length > 0" class="grid gap-4 sm:grid-cols-2">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @share="shareTaskId = $event"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <AppIcon name="ClipboardCheckIcon" class="mx-auto size-10 text-gray-300" />
        <p class="mt-3 text-sm font-medium text-gray-500">Nenhuma tarefa encontrada</p>
        <p class="mt-1 text-xs text-gray-400">Crie uma nova tarefa para começar</p>
      </div>
    </div>

    <!-- Modals -->
    <CreateTaskModal :open="showCreateModal" @close="showCreateModal = false" />
    <ShareTaskModal
      :open="shareTaskId !== null"
      :task-id="shareTaskId"
      @close="shareTaskId = null"
    />
  </AppLayout>
</template>
