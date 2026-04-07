import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '@/services/categoryService'
import { useToastStore } from '@/stores/toast'
import type { CategoryWithCount } from '@/types/task'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<CategoryWithCount[]>([])
  const loading = ref(false)

  async function fetchCategories() {
    loading.value = true
    try {
      categories.value = await categoryService.getAll()
    } catch {
      const toast = useToastStore()
      toast.error('Erro ao carregar categorias. Tente novamente.')
    } finally {
      loading.value = false
    }
  }

  async function createCategory(name: string) {
    await categoryService.create(name)
    await fetchCategories()
  }

  async function updateCategory(id: string, name: string) {
    await categoryService.update(id, name)
    await fetchCategories()
  }

  async function deleteCategory(id: string) {
    await categoryService.delete(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  return { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory }
})
