<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const serverError = ref('')
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '' })

function validate() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  serverError.value = ''

  if (!form.name) errors.name = 'Nome é obrigatório'
  if (!form.email) errors.email = 'E-mail é obrigatório'
  else if (!/^[^@]+@[^@]+.[^@]+$/.test(form.email)) errors.email = 'E-mail inválido'
  if (!form.password) errors.password = 'Senha é obrigatória'
  else if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres'
  if (!form.confirmPassword) errors.confirmPassword = 'Confirme a senha'
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'As senhas não coincidem'

  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

async function handleRegister() {
  if (!validate()) return
  loading.value = true
  try {
    await auth.register({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    })
    toast.success('Conta criada com sucesso! Faça login para continuar.')
    router.push({ name: 'login' })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data
      if (data?.errors && Array.isArray(data.errors)) {
        for (const fieldError of data.errors) {
          const field = fieldError.field as keyof typeof errors
          if (field in errors) errors[field] = fieldError.message
        }
      } else {
        serverError.value = data?.message ?? 'Erro ao criar conta. Tente novamente.'
      }
    } else {
      serverError.value = 'Erro inesperado. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-600">
          <AppIcon name="ClipboardCheckIcon" class="size-6 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Task Manager</h1>
        <p class="mt-1 text-sm text-gray-500">Crie sua conta gratuitamente</p>
      </div>

      <div v-if="serverError" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ serverError }}
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <BaseInput
          v-model="form.name"
          label="Nome completo"
          placeholder="Seu nome"
          :error="errors.name"
        />
        <BaseInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          :error="errors.email"
        />
        <BaseInput
          v-model="form.password"
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          :error="errors.password"
        />
        <BaseInput
          v-model="form.confirmPassword"
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          :error="errors.confirmPassword"
        />

        <BaseButton type="submit" :loading="loading" full class="mt-2">
          Criar conta
        </BaseButton>
      </form>

      <p class="text-center text-sm text-gray-500">
        Já tem uma conta?
        <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-700">
          Entrar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
