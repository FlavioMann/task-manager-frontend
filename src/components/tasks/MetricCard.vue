<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  color: 'gray' | 'yellow' | 'blue' | 'green' | 'purple'
  progress?: string
}>()

const colorClasses = {
  gray:   { label: 'text-gray-500',   value: 'text-gray-900',   bar: 'bg-gray-400'   },
  yellow: { label: 'text-yellow-600', value: 'text-yellow-600', bar: 'bg-yellow-400' },
  blue:   { label: 'text-blue-600',   value: 'text-blue-600',   bar: 'bg-blue-500'   },
  green:  { label: 'text-green-600',  value: 'text-green-600',  bar: 'bg-green-500'  },
  purple: { label: 'text-purple-600', value: 'text-purple-600', bar: 'bg-purple-500' },
}
</script>

<template>
  <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <p :class="['text-xs font-medium uppercase tracking-wide', colorClasses[color].label]">
      {{ label }}
    </p>
    <p :class="['mt-1 text-2xl font-bold', colorClasses[color].value]">
      {{ value }}
    </p>
    <template v-if="progress !== undefined">
      <div class="mt-2 h-1.5 w-full rounded-full bg-gray-100">
        <div
          :class="['h-1.5 rounded-full transition-all duration-500', colorClasses[color].bar]"
          :style="{ width: progress }"
        />
      </div>
    </template>
  </div>
</template>
