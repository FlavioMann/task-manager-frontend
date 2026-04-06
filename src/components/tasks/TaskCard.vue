<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge.vue'
import DeleteTaskModal from '@/components/tasks/DeleteTaskModal.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { Task, TaskStatus } from '@/types/task'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{ share: [taskId: string] }>()

const tasksStore = useTasksStore()
const toast = useToastStore()
const auth = useAuthStore()

const showDeleteModal = ref(false)

const isOwner = auth.user?.id === props.task.ownerId
const updatingStatus = ref(false)

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'COMPLETED', label: 'Concluída' },
]

const borderColors: Record<TaskStatus, string> = {
  PENDING: 'border-l-yellow-400',
  IN_PROGRESS: 'border-l-blue-500',
  COMPLETED: 'border-l-green-500',
}

async function handleStatusChange(event: Event) {
  const status = (event.target as HTMLSelectElement).value as TaskStatus
  updatingStatus.value = true
  try {
    await tasksStore.updateStatus(props.task.id, status)
    toast.success('Status atualizado!')
  } catch {
    toast.error('Erro ao atualizar status.')
  } finally {
    updatingStatus.value = false
  }
}
</script>

<template>
  <div
    :class="['rounded-xl border border-gray-200 border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md', borderColors[task.status]]"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
        <p v-if="task.description" class="mt-0.5 text-sm text-gray-500 line-clamp-2">
          {{ task.description }}
        </p>
      </div>
      <TaskStatusBadge :status="task.status" />
    </div>

    <div v-if="task.category" class="mt-3">
      <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
        {{ task.category.name }}
      </span>
    </div>

    <div class="mt-4 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-1 text-xs text-gray-400">
        <AppIcon name="UserIcon" class="size-3.5 shrink-0" />
        <span class="truncate">{{ task.owner.name }}</span>
        <span v-if="task.collaborators.length > 0" class="ml-1 shrink-0">
          · {{ task.collaborators.length }} colaborador{{ task.collaborators.length > 1 ? 'es' : '' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="isOwner"
          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
          title="Compartilhar"
          @click="emit('share', task.id)"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        <button
          v-if="isOwner"
          class="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          title="Excluir"
          @click="showDeleteModal = true"
        >
          <AppIcon name="TrashIcon" class="size-4" />
        </button>

        <select
          v-if="isOwner"
          :value="task.status"
          :disabled="updatingStatus"
          class="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 sm:w-auto"
          @change="handleStatusChange"
        >
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <DeleteTaskModal
      :open="showDeleteModal"
      :task-id="task.id"
      :task-title="task.title"
      @close="showDeleteModal = false"
    />
  </div>
</template>
