import { api } from '@/lib/api'

export interface CreateUserPayload {
  name: string
  email: string
  password: string
}

export interface CreateUserResponse {
  userId: string
}

export const userService = {
  async create(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const { data } = await api.post<CreateUserResponse>('/users', payload)
    return data
  },
}
