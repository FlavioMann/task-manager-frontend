<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const serverError = ref('')
const errors = reactive({ email: '', password: '' })

function validate() {
  errors.email = ''
  errors.password = ''
  if (!form.email) errors.email = 'E-mail é obrigatório'
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errors.email = 'E-mail inválido'
  if (!form.password) errors.password = 'Senha é obrigatória'
  return !errors.email && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await auth.login({ email: form.email, password: form.password })
    router.push({ name: 'tasks' })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      serverError.value = error.response?.data?.message ?? 'Erro ao fazer login. Tente novamente.'
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
      <!-- Logo / Título -->
      <div class="text-center">
        <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-600">
          <AppIcon name="ClipboardCheckIcon" class="size-6 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Task Manager</h1>
        <p class="mt-1 text-sm text-gray-500">Entre na sua conta</p>
      </div>

      <!-- Erro do servidor -->
      <div
        v-if="serverError"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ serverError }}
      </div>

      <!-- Formulário -->
      <form class="space-y-4" @submit.prevent="handleLogin">
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
          placeholder="••••••••"
          :error="errors.password"
        />

        <BaseButton type="submit" :loading="loading" full class="mt-2">
          Entrar
        </BaseButton>
      </form>

      <!-- Link para cadastro -->
      <p class="text-center text-sm text-gray-500">
        Não tem uma conta?
        <RouterLink to="/register" class="font-medium text-blue-600 hover:text-blue-700">
          Criar conta
        </RouterLink>
      </p>
    </div>
  </div>
</template>
