import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockTask = {
  id: 'task-1',
  title: 'Tarefa de teste',
  description: null,
  status: 'PENDING',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  categoryId: null,
  ownerId: 'user-123',
  category: null,
  owner: { name: 'Flavi', email: 'flavi@test.com' },
  collaborators: [],
}

vi.mock('@/services/taskService', () => ({
  taskService: {
    getAll: vi.fn().mockResolvedValue([mockTask]),
    create: vi.fn().mockResolvedValue({ taskId: 'task-new' }),
    updateStatus: vi.fn().mockResolvedValue(undefined),
    share: vi.fn().mockResolvedValue({ message: 'Compartilhado!' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('inicia com lista vazia e loading false', async () => {
    const { useTasksStore } = await import('@/stores/tasks')
    const store = useTasksStore()
    expect(store.tasks).toHaveLength(0)
    expect(store.loading).toBe(false)
  })

  it('fetchTasks carrega tarefas e desativa loading', async () => {
    const { useTasksStore } = await import('@/stores/tasks')
    const store = useTasksStore()
    await store.fetchTasks()
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0]!.id).toBe('task-1')
    expect(store.loading).toBe(false)
  })

  it('createTask chama service e recarrega lista', async () => {
    const { useTasksStore } = await import('@/stores/tasks')
    const { taskService } = await import('@/services/taskService')
    const store = useTasksStore()
    await store.createTask({ title: 'Nova tarefa' })
    expect(taskService.create).toHaveBeenCalledWith({ title: 'Nova tarefa' })
    expect(taskService.getAll).toHaveBeenCalled()
  })

  it('updateStatus atualiza o status localmente', async () => {
    const { useTasksStore } = await import('@/stores/tasks')
    const store = useTasksStore()
    await store.fetchTasks()
    await store.updateStatus('task-1', 'COMPLETED')
    expect(store.tasks[0]!.status).toBe('COMPLETED')
  })

  it('deleteTask remove tarefa do array', async () => {
    const { useTasksStore } = await import('@/stores/tasks')
    const store = useTasksStore()
    await store.fetchTasks()
    expect(store.tasks).toHaveLength(1)
    await store.deleteTask('task-1')
    expect(store.tasks).toHaveLength(0)
  })

  it('shareTask chama service com id e email corretos', async () => {
    const { useTasksStore } = await import('@/stores/tasks')
    const { taskService } = await import('@/services/taskService')
    const store = useTasksStore()
    await store.shareTask('task-1', 'colega@test.com')
    expect(taskService.share).toHaveBeenCalledWith('task-1', 'colega@test.com')
  })
})
