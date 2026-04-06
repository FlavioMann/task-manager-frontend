<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useTasksStore } from '@/stores/tasks'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps<{
  open: boolean
  taskId: string | null
  taskTitle: string
}>()

const emit = defineEmits<{ close: [] }>()

const tasksStore = useTasksStore()
const toast = useToastStore()
const loading = ref(false)

async function handleConfirm() {
  if (!props.taskId) return
  loading.value = true
  try {
    await tasksStore.deleteTask(props.taskId)
    toast.success('Tarefa excluída com sucesso!')
    emit('close')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message ?? 'Erro ao excluir tarefa.')
    } else {
      toast.error('Erro inesperado. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseModal title="Excluir tarefa" :open="open" @close="emit('close')">
    <div class="space-y-4">
      <!-- Ícone de aviso -->
      <div class="flex items-start gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AppIcon name="TrashIcon" class="size-5 text-red-600" />
        </div>
        <div>
          <p class="text-sm text-gray-700">
            Tem certeza que deseja excluir a tarefa
            <span class="font-semibold text-gray-900">"{{ taskTitle }}"</span>?
          </p>
          <p class="mt-1 text-xs text-gray-400">Essa ação não pode ser desfeita.</p>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex justify-end gap-2 pt-2">
        <BaseButton variant="secondary" :disabled="loading" @click="emit('close')">
          Cancelar
        </BaseButton>
        <BaseButton
          class="bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
          :loading="loading"
          @click="handleConfirm"
        >
          Excluir
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
