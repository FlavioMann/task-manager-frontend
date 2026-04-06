<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import AppIcon from '@/components/ui/AppIcon.vue'

const toast = useToastStore()

const iconNames = {
  success: 'CheckIcon',
  error: 'XMarkIcon',
  warning: 'AlertIcon',
  info: 'InfoIcon',
}

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-50 flex flex-col gap-2" aria-live="polite">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="t in toast.toasts"
          :key="t.id"
          :class="['flex w-80 items-start gap-3 rounded-lg border px-4 py-3 shadow-md', styles[t.type]]"
        >
          <AppIcon :name="iconNames[t.type]" :class="['size-5 shrink-0', iconStyles[t.type]]" />
          <span class="flex-1 text-sm font-medium">{{ t.message }}</span>
          <button
            class="ml-auto opacity-60 hover:opacity-100"
            aria-label="Fechar"
            @click="toast.remove(t.id)"
          >
            <AppIcon name="XMarkIcon" class="size-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

