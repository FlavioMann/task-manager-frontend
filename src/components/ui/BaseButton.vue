<script setup lang="ts">
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
