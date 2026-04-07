<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { useCategoriesStore } from '@/stores/categories'
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{
  open: boolean
  categoryId: string | null
  categoryName: string
}>()
const emit = defineEmits<{ close: [] }>()

const categoriesStore = useCategoriesStore()
const toast = useToastStore()

const form = reactive({ name: '' })
const errors = reactive({ name: '' })
const loading = ref(false)
const serverError = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = props.categoryName
      errors.name = ''
      serverError.value = ''
    }
  },
)

function validate() {
  errors.name = ''
  if (!form.name) errors.name = 'Nome é obrigatório'
  else if (form.name.length < 2) errors.name = 'Mínimo 2 caracteres'
  return !errors.name
}

async function handleSubmit() {
  if (!props.categoryId || !validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await categoriesStore.updateCategory(props.categoryId, form.name)
    toast.success('Categoria atualizada com sucesso!')
    emit('close')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      serverError.value = error.response?.data?.message ?? 'Erro ao atualizar categoria.'
    } else {
      serverError.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseModal title="Editar categoria" :open="open" @close="emit('close')">
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
        <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
        <BaseButton type="submit" :loading="loading">Salvar alterações</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
