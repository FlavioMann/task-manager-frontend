import { api } from '@/lib/api'
import type { Task, CreateTaskPayload, TaskStatus } from '@/types/task'

export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks')
    return data
  },

  async create(payload: CreateTaskPayload): Promise<{ taskId: string }> {
    const { data } = await api.post<{ taskId: string }>('/tasks', payload)
    return data
  },

  async updateStatus(id: string, status: TaskStatus): Promise<void> {
    await api.patch(`/tasks/${id}/status`, { status })
  },

  async share(id: string, email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(`/tasks/${id}/share`, { email })
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
