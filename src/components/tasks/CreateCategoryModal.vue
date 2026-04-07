<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useCategoriesStore } from '@/stores/categories'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const categoriesStore = useCategoriesStore()
const toast = useToastStore()

const form = reactive({ name: '' })
const errors = reactive({ name: '' })
const loading = ref(false)
const serverError = ref('')

function reset() {
  form.name = ''
  errors.name = ''
  serverError.value = ''
}

function validate() {
  errors.name = ''
  if (!form.name) errors.name = 'Nome é obrigatório'
  else if (form.name.length < 2) errors.name = 'Mínimo 2 caracteres'
  return !errors.name
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await categoriesStore.createCategory(form.name)
    toast.success('Categoria criada com sucesso!')
    reset()
    emit('close')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      serverError.value = error.response?.data?.message ?? 'Erro ao criar categoria.'
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
  <BaseModal title="Nova categoria" :open="open" @close="handleClose">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="serverError" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ serverError }}
      </div>

      <BaseInput
        v-model="form.name"
        label="Nome da categoria"
        placeholder="Ex: Trabalho, Estudos, Pessoal"
        :error="errors.name"
      />

      <div class="flex justify-end gap-2 pt-2">
        <BaseButton variant="secondary" @click="handleClose">Cancelar</BaseButton>
        <BaseButton type="submit" :loading="loading">Criar categoria</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
