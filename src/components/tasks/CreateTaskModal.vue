<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useTasksStore } from '@/stores/tasks'
import { useToastStore } from '@/stores/toast'
import { useCategoriesStore } from '@/stores/categories'
import { categoryService } from '@/services/categoryService'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const tasksStore = useTasksStore()
const toast = useToastStore()
const categoriesStore = useCategoriesStore()

onMounted(() => {
  if (categoriesStore.categories.length === 0) categoriesStore.fetchCategories()
})

const form = reactive({ title: '', description: '', categoryId: '', newCategoryName: '' })
const errors = reactive({ title: '', newCategoryName: '' })
const loading = ref(false)
const serverError = ref('')

const isNewCategory = computed(() => form.categoryId === '__new__')

function reset() {
  form.title = ''
  form.description = ''
  form.categoryId = ''
  form.newCategoryName = ''
  errors.title = ''
  errors.newCategoryName = ''
  serverError.value = ''
}

function validate() {
  errors.title = ''
  errors.newCategoryName = ''
  if (!form.title) errors.title = 'Título é obrigatório'
  else if (form.title.length < 3) errors.title = 'Mínimo 3 caracteres'
  if (isNewCategory.value && !form.newCategoryName)
    errors.newCategoryName = 'Nome da categoria é obrigatório'
  return !errors.title && !errors.newCategoryName
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    let categoryId: string | undefined

    if (isNewCategory.value && form.newCategoryName) {
      const { categoryId: newId } = await categoryService.create(form.newCategoryName)
      categoryId = newId
      await categoriesStore.fetchCategories()
    } else if (form.categoryId && form.categoryId !== '') {
      categoryId = form.categoryId
    }

    await tasksStore.createTask({
      title: form.title,
      description: form.description || undefined,
      categoryId: categoryId ?? '',
    })

    toast.success('Tarefa criada com sucesso!')
    reset()
    emit('close')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      serverError.value = error.response?.data?.message ?? 'Erro ao criar tarefa.'
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
  <BaseModal title="Nova tarefa" :open="open" @close="handleClose">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="serverError" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ serverError }}
      </div>

      <BaseInput
        v-model="form.title"
        label="Título"
        placeholder="Ex: Estudar Vue 3"
        :error="errors.title"
      />

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          Descrição <span class="text-gray-400">(opcional)</span>
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Descreva a tarefa..."
          class="resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div class="flex flex-col gap-1 pb-2">
        <label class="text-sm font-medium text-gray-700">
          Categoria <span class="text-gray-400">(opcional)</span>
        </label>
        <select
          v-model="form.categoryId"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Sem categoria</option>
          <option v-for="cat in categoriesStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
          <option value="__new__">+ Nova categoria</option>
        </select>
      </div>

      <BaseInput
        v-if="isNewCategory"
        v-model="form.newCategoryName"
        label="Nome da nova categoria"
        placeholder="Ex: Trabalho, Estudos, Pessoal"
        :error="errors.newCategoryName"
      />

      <div class="flex justify-end gap-2 pt-2">
        <BaseButton variant="secondary" @click="handleClose">Cancelar</BaseButton>
        <BaseButton type="submit" :loading="loading">Criar tarefa</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

