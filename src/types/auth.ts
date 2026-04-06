export interface User {
  id: string
  name: string
  email: string
}

export interface AuthUser {
  id: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}
