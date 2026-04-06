<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const navItems = [
  { name: 'tasks', label: 'Tarefas', icon: 'ClipboardCheckIcon' },
  { name: 'reports', label: 'Relatórios', icon: 'ChartBarIcon' },
]

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-lg bg-blue-600">
            <AppIcon name="ClipboardCheckIcon" class="size-4 text-white" />
          </div>
          <span class="hidden text-base font-bold text-gray-900 sm:inline">Task Manager</span>
        </div>

        <!-- Nav -->
        <nav class="flex items-center gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            :class="[
              'flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition sm:px-3',
              route.name === item.name
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            <AppIcon :name="item.icon" class="size-4" />
            <span class="hidden sm:inline">{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- Logout -->
        <BaseButton variant="ghost" @click="handleLogout">
          <AppIcon name="LogOutIcon" class="size-4" />
          <span class="hidden sm:inline">Sair</span>
        </BaseButton>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <slot />
    </main>
  </div>
</template>
