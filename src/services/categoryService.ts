import { api } from '@/lib/api'
import type { CategoryWithCount } from '@/types/task'

export const categoryService = {
  async create(name: string): Promise<{ categoryId: string }> {
    const { data } = await api.post<{ categoryId: string }>('/categories', { name })
    return data
  },

  async getAll(): Promise<CategoryWithCount[]> {
    const { data } = await api.get<{ categories: CategoryWithCount[] }>('/categories')
    return data.categories
  },

  async getById(id: string): Promise<{ id: string; name: string }> {
    const { data } = await api.get<{ category: { id: string; name: string } }>(`/categories/${id}`)
    return data.category
  },

  async update(id: string, name: string): Promise<{ id: string; name: string }> {
    const { data } = await api.patch<{ category: { id: string; name: string } }>(`/categories/${id}`, { name })
    return data.category
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
