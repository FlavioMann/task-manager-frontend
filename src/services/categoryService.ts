import { api } from '@/lib/api'

export const categoryService = {
  async create(name: string): Promise<{ categoryId: string }> {
    const { data } = await api.post<{ categoryId: string }>('/categories', { name })
    return data
  },
}
