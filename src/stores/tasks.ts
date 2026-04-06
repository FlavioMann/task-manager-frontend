import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/taskService'
import type { Task, CreateTaskPayload, TaskStatus } from '@/types/task'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  async function fetchTasks() {
    loading.value = true
    try {
      tasks.value = await taskService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: CreateTaskPayload) {
    await taskService.create(payload)
    await fetchTasks()
  }

  async function updateStatus(id: string, status: TaskStatus) {
    await taskService.updateStatus(id, status)
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.status = status
  }

  async function shareTask(id: string, email: string) {
    return taskService.share(id, email)
  }

  async function deleteTask(id: string) {
    await taskService.delete(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, loading, fetchTasks, createTask, updateStatus, shareTask, deleteTask }
})
