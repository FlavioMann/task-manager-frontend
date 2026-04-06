import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

describe('taskService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('getAll faz GET /tasks e retorna dados', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.get).mockResolvedValue({ data: [{ id: 'task-1' }] })
    const { taskService } = await import('@/services/taskService')
    const result = await taskService.getAll()
    expect(api.get).toHaveBeenCalledWith('/tasks')
    expect(result[0].id).toBe('task-1')
  })

  it('create faz POST /tasks com payload correto', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.post).mockResolvedValue({ data: { taskId: 'abc-123' } })
    const { taskService } = await import('@/services/taskService')
    const result = await taskService.create({ title: 'Tarefa' })
    expect(api.post).toHaveBeenCalledWith('/tasks', { title: 'Tarefa' })
    expect(result.taskId).toBe('abc-123')
  })

  it('updateStatus faz PATCH /tasks/:id/status', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.patch).mockResolvedValue({ data: undefined })
    const { taskService } = await import('@/services/taskService')
    await taskService.updateStatus('task-1', 'COMPLETED')
    expect(api.patch).toHaveBeenCalledWith('/tasks/task-1/status', { status: 'COMPLETED' })
  })

  it('share faz POST /tasks/:id/share com email', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.post).mockResolvedValue({ data: { message: 'Compartilhado!' } })
    const { taskService } = await import('@/services/taskService')
    const result = await taskService.share('task-1', 'colega@test.com')
    expect(api.post).toHaveBeenCalledWith('/tasks/task-1/share', { email: 'colega@test.com' })
    expect(result.message).toBe('Compartilhado!')
  })

  it('delete faz DELETE /tasks/:id', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.delete).mockResolvedValue({ data: undefined })
    const { taskService } = await import('@/services/taskService')
    await taskService.delete('task-1')
    expect(api.delete).toHaveBeenCalledWith('/tasks/task-1')
  })
})
