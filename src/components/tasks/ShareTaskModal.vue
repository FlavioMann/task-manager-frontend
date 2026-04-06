<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useTasksStore } from '@/stores/tasks'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ open: boolean; taskId: string | null }>()
const emit = defineEmits<{ close: [] }>()

const tasksStore = useTasksStore()
const toast = useToastStore()

const email = ref('')
const emailError = ref('')
const loading = ref(false)
const serverError = ref('')

function reset() {
  email.value = ''
  emailError.value = ''
  serverError.value = ''
}

function validate() {
  emailError.value = ''
  if (!email.value) emailError.value = 'E-mail é obrigatório'
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) emailError.value = 'E-mail inválido'
  return !emailError.value
}

async function handleSubmit() {
  if (!validate() || !props.taskId) return
  loading.value = true
  serverError.value = ''
  try {
    await tasksStore.shareTask(props.taskId, email.value)
    await tasksStore.fetchTasks()
    toast.success(`Tarefa compartilhada com ${email.value}!`)
    reset()
    emit('close')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      serverError.value = error.response?.data?.message ?? 'Erro ao compartilhar tarefa.'
    } else {
      serverError.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

function handleClose() {
  reset()
  emit('close')
}
</script>

<template>
  <BaseModal title="Compartilhar tarefa" :open="open" @close="handleClose">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div
        v-if="serverError"
        class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ serverError }}
      </div>

      <p class="text-sm text-gray-500">
        Digite o e-mail do usuário com quem deseja compartilhar esta tarefa.
      </p>

      <BaseInput
        v-model="email"
        label="E-mail do colaborador"
        type="email"
        placeholder="colaborador@email.com"
        :error="emailError"
      />

      <div class="flex justify-end gap-2 pt-2">
        <BaseButton variant="secondary" @click="handleClose">Cancelar</BaseButton>
        <BaseButton type="submit" :loading="loading">Compartilhar</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
