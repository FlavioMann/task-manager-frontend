import { api } from '@/lib/api'
import type { LoginPayload } from '@/types/auth'

export interface AuthResponse {
  token: string
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/sessions', payload)
    return data
  },
}
