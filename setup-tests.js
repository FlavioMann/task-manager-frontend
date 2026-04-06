import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(__dirname, 'src')

const dirs = [
  path.join('__tests__', 'stores'),
  path.join('__tests__', 'services'),
  path.join('__tests__', 'components'),
]

dirs.forEach((d) => {
  fs.mkdirSync(path.join(src, d), { recursive: true })
  console.log(`✓ src/${d}`)
})

const files = {}

// ─── stores/toast ────────────────────────────────────────────
files['__tests__/stores/toast.spec.ts'] = `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from '@/stores/toast'

describe('useToastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('inicia com lista vazia', () => {
    const toast = useToastStore()
    expect(toast.toasts).toHaveLength(0)
  })

  it('adiciona um toast de sucesso', () => {
    const toast = useToastStore()
    toast.success('Operação realizada!')
    expect(toast.toasts).toHaveLength(1)
    expect(toast.toasts[0].message).toBe('Operação realizada!')
    expect(toast.toasts[0].type).toBe('success')
  })

  it('adiciona um toast de erro', () => {
    const toast = useToastStore()
    toast.error('Algo deu errado')
    expect(toast.toasts[0].type).toBe('error')
  })

  it('adiciona um toast info', () => {
    const toast = useToastStore()
    toast.info('Informação')
    expect(toast.toasts[0].type).toBe('info')
  })

  it('adiciona um toast warning', () => {
    const toast = useToastStore()
    toast.warning('Atenção')
    expect(toast.toasts[0].type).toBe('warning')
  })

  it('remove toast automaticamente após 4s', () => {
    const toast = useToastStore()
    toast.success('Auto remove')
    expect(toast.toasts).toHaveLength(1)
    vi.advanceTimersByTime(4000)
    expect(toast.toasts).toHaveLength(0)
  })

  it('remove toast manualmente pelo id', () => {
    const toast = useToastStore()
    toast.success('Remove manual')
    const id = toast.toasts[0].id
    toast.remove(id)
    expect(toast.toasts).toHaveLength(0)
  })

  it('suporta múltiplos toasts simultâneos', () => {
    const toast = useToastStore()
    toast.success('Um')
    toast.error('Dois')
    toast.info('Três')
    expect(toast.toasts).toHaveLength(3)
  })

  it('cada toast tem id único', () => {
    const toast = useToastStore()
    toast.success('A')
    toast.success('B')
    const ids = toast.toasts.map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
  })
})
`

// ─── stores/auth ─────────────────────────────────────────────
files['__tests__/stores/auth.spec.ts'] = `import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ sub: 'user-123', iat: 0, exp: 9999999999 })) +
  '.signature'

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ token: FAKE_TOKEN }),
  },
}))

vi.mock('@/services/userService', () => ({
  userService: {
    create: vi.fn().mockResolvedValue({ userId: 'new-user-id' }),
  },
}))

vi.mock('@/lib/api', () => ({
  api: { post: vi.fn(), get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('inicia sem usuário logado quando não há token', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('realiza login e popula user com id do token', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    await auth.login({ email: 'test@test.com', password: '123456' })
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user?.id).toBe('user-123')
    expect(auth.token).toBe(FAKE_TOKEN)
  })

  it('persiste token no localStorage após login', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    await auth.login({ email: 'test@test.com', password: '123456' })
    expect(localStorage.getItem('auth_token')).toBe(FAKE_TOKEN)
  })

  it('logout limpa user, token e localStorage', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    await auth.login({ email: 'test@test.com', password: '123456' })
    auth.logout()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('register chama userService.create com os dados corretos', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const { userService } = await import('@/services/userService')
    const auth = useAuthStore()
    await auth.register({
      name: 'Flavi',
      email: 'flavi@test.com',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(userService.create).toHaveBeenCalledWith({
      name: 'Flavi',
      email: 'flavi@test.com',
      password: '123456',
    })
  })
})
`

// ─── stores/tasks ────────────────────────────────────────────
files['__tests__/stores/tasks.spec.ts'] = `import { describe, it, expect, beforeEach, vi } from 'vitest'
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
    expect(store.tasks[0].id).toBe('task-1')
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
    expect(store.tasks[0].status).toBe('COMPLETED')
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
`

// ─── services/taskService ─────────────────────────────────────
files['__tests__/services/taskService.spec.ts'] = `import { describe, it, expect, vi, beforeEach } from 'vitest'

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
`

// ─── services/authService ─────────────────────────────────────
files['__tests__/services/authService.spec.ts'] = `import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api', () => ({
  api: { post: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}))

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('login faz POST /sessions e retorna token', async () => {
    const { api } = await import('@/lib/api')
    vi.mocked(api.post).mockResolvedValue({ data: { token: 'jwt-token-123' } })
    const { authService } = await import('@/services/authService')
    const result = await authService.login({ email: 'a@a.com', password: '123456' })
    expect(api.post).toHaveBeenCalledWith('/sessions', { email: 'a@a.com', password: '123456' })
    expect(result.token).toBe('jwt-token-123')
  })
})
`

// ─── components/TaskStatusBadge ───────────────────────────────
files['__tests__/components/TaskStatusBadge.spec.ts'] = `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge.vue'

describe('TaskStatusBadge', () => {
  it('exibe "Pendente" para status PENDING', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'PENDING' } })
    expect(wrapper.text()).toBe('Pendente')
  })

  it('exibe "Em andamento" para status IN_PROGRESS', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'IN_PROGRESS' } })
    expect(wrapper.text()).toBe('Em andamento')
  })

  it('exibe "Concluída" para status COMPLETED', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'COMPLETED' } })
    expect(wrapper.text()).toBe('Concluída')
  })

  it('aplica classe bg-yellow-100 para PENDING', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'PENDING' } })
    expect(wrapper.find('span').classes()).toContain('bg-yellow-100')
  })

  it('aplica classe bg-blue-100 para IN_PROGRESS', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'IN_PROGRESS' } })
    expect(wrapper.find('span').classes()).toContain('bg-blue-100')
  })

  it('aplica classe bg-green-100 para COMPLETED', () => {
    const wrapper = mount(TaskStatusBadge, { props: { status: 'COMPLETED' } })
    expect(wrapper.find('span').classes()).toContain('bg-green-100')
  })
})
`

// ─── components/MetricCard ────────────────────────────────────
files['__tests__/components/MetricCard.spec.ts'] = `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricCard from '@/components/tasks/MetricCard.vue'

describe('MetricCard', () => {
  it('exibe o label e o valor corretamente', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Total', value: 42, color: 'gray' } })
    expect(wrapper.text()).toContain('Total')
    expect(wrapper.text()).toContain('42')
  })

  it('aceita valor como string', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Progresso', value: '50%', color: 'blue' } })
    expect(wrapper.text()).toContain('50%')
  })

  it('exibe barra de progresso quando progress é fornecido', () => {
    const wrapper = mount(MetricCard, {
      props: { label: 'Progresso', value: '75%', color: 'blue', progress: '75%' },
    })
    const bar = wrapper.find('[style]')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('style')).toContain('75%')
  })

  it('não exibe barra quando progress não é fornecido', () => {
    const wrapper = mount(MetricCard, { props: { label: 'Total', value: 10, color: 'gray' } })
    expect(wrapper.find('[style]').exists()).toBe(false)
  })
})
`

// ─── components/BaseButton ────────────────────────────────────
files['__tests__/components/BaseButton.spec.ts'] = `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renderiza o slot corretamente', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Clique aqui' } })
    expect(wrapper.text()).toContain('Clique aqui')
  })

  it('aplica estilo primary por padrão', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.classes()).toContain('bg-blue-600')
  })

  it('aplica estilo secondary quando variant="secondary"', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('border-gray-300')
  })

  it('aplica estilo ghost quando variant="ghost"', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'ghost' } })
    expect(wrapper.classes()).toContain('text-gray-600')
  })

  it('fica desabilitado quando disabled=true', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('exibe spinner quando loading=true', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('ocupa largura total quando full=true', () => {
    const wrapper = mount(BaseButton, { props: { full: true } })
    expect(wrapper.classes()).toContain('w-full')
  })
})
`

// ─── components/BaseInput ─────────────────────────────────────
files['__tests__/components/BaseInput.spec.ts'] = `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/ui/BaseInput.vue'

describe('BaseInput', () => {
  it('renderiza o label quando fornecido', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', label: 'E-mail' } })
    expect(wrapper.find('label').text()).toBe('E-mail')
  })

  it('não renderiza label quando não fornecido', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('exibe mensagem de erro', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', error: 'Campo obrigatório' } })
    expect(wrapper.find('span').text()).toBe('Campo obrigatório')
  })

  it('aplica classe de erro no input', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', error: 'Inválido' } })
    expect(wrapper.find('input').classes()).toContain('border-red-400')
  })

  it('emite update:modelValue ao digitar', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('novo valor')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['novo valor'])
  })

  it('usa type="text" por padrão', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('usa o type fornecido via prop', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', type: 'password' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })
})
`

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(src, filePath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content)
  console.log(`✓ src/${filePath}`)
})

console.log('\n✅ 37 testes criados em 8 arquivos!')
console.log('\n📌 Agora rode: npm test')





