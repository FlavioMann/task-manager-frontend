// Script de setup da estrutura do projeto task-manager-frontend
// Execute: node setup.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup de pastas adicionais
const extraDirs = ['src/lib']
for (const dir of extraDirs) {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true })
}

const root = path.join(__dirname, 'src')

const files = {
  'types/auth.ts': `export interface User {
  id: string
  name: string
  email: string
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
`,

  'router/index.ts': `import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/tasks/TasksView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.requiresGuest && auth.isLoggedIn) {
    return { name: 'tasks' }
  }
})

export default router
`,

  'stores/auth.ts': `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginPayload, RegisterPayload } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  function login(payload: LoginPayload) {
    // TODO: integrar com API
    console.log('login', payload)
  }

  function register(payload: RegisterPayload) {
    // TODO: integrar com API
    console.log('register', payload)
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, register, logout }
})
`,

  'components/ui/BaseInput.vue': `<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
`,

  'components/ui/BaseButton.vue': `<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  disabled?: boolean
  full?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'w-full': full,
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800': !variant || variant === 'primary',
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50': variant === 'secondary',
      'text-gray-600 hover:bg-gray-100': variant === 'ghost',
    }"
  >
    <svg
      v-if="loading"
      class="size-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 14 6.477 14 12h-4z"
      />
    </svg>
    <slot />
  </button>
</template>
`,

  'views/auth/LoginView.vue': `<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
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
  try {
    await auth.login({ email: form.email, password: form.password })
    router.push({ name: 'tasks' })
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
          <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Task Manager</h1>
        <p class="mt-1 text-sm text-gray-500">Entre na sua conta</p>
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
`,

  'views/auth/RegisterView.vue': `<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '' })

function validate() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.name) errors.name = 'Nome é obrigatório'
  if (!form.email) errors.email = 'E-mail é obrigatório'
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errors.email = 'E-mail inválido'
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
    router.push({ name: 'login' })
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
          <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Task Manager</h1>
        <p class="mt-1 text-sm text-gray-500">Crie sua conta gratuitamente</p>
      </div>

      <!-- Formulário -->
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

      <!-- Link para login -->
      <p class="text-center text-sm text-gray-500">
        Já tem uma conta?
        <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-700">
          Entrar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
`,

  'views/tasks/TasksView.vue': `<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b bg-white px-6 py-4">
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <h1 class="text-lg font-bold text-gray-900">Task Manager</h1>
        <BaseButton variant="ghost" @click="handleLogout">Sair</BaseButton>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-10">
      <div class="text-center text-gray-400">
        <p class="text-lg font-medium">Nenhuma tarefa ainda</p>
        <p class="mt-1 text-sm">Em breve você poderá gerenciar suas tarefas aqui.</p>
      </div>
    </main>
  </div>
</template>
`,

  'services/.gitkeep': '',
}

// Arquivos fora de src/ que também precisam ser atualizados
const rootFiles = {
  'src/App.vue': `<script setup lang="ts"></script>

<template>
  <RouterView />
</template>
`,
  'src/main.ts': `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
`,
}

let created = 0
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, filePath)
  const dir = path.dirname(fullPath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(fullPath, content, 'utf8')
  console.log('✅ src/' + filePath)
  created++
}

for (const [filePath, content] of Object.entries(rootFiles)) {
  const fullPath = path.join(__dirname, filePath)
  fs.writeFileSync(fullPath, content, 'utf8')
  console.log('✅', filePath)
  created++
}

console.log(`\n✨ ${created} arquivos criados/atualizados!`)
console.log('\nInstale as dependências:')
console.log('  npm install vue-router@4 pinia')
console.log('\nDepois rode:')
console.log('  npm run dev')
console.log('\nAcesse http://localhost:5173 — você verá a tela de login!')
