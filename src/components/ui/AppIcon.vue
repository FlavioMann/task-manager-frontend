<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps<{
  name: string
}>()

const icon = defineAsyncComponent(
  () => import(`@/components/icons/${props.name}.vue`),
)
</script>

<template>
  <component :is="icon" />
</template>
