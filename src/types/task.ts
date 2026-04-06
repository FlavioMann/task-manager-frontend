export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
  categoryId: string | null
  ownerId: string
  category: { name: string } | null
  owner: { name: string; email: string }
  collaborators: { name: string }[]
}

export interface CreateTaskPayload {
  title: string
  description?: string
  categoryId?: string | null
}

export interface Category {
  id: string
  name: string
}

export interface Metrics {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  progressPercentage: string
  tasksByCategory: { categoryId: string | null; _count: { id: number } }[]
}
