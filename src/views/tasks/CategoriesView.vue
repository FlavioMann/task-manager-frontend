<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import AppLayout from '@/components/ui/AppLayout.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CreateCategoryModal from '@/components/tasks/CreateCategoryModal.vue'
import EditCategoryModal from '@/components/tasks/EditCategoryModal.vue'
import DeleteCategoryModal from '@/components/tasks/DeleteCategoryModal.vue'

const categoriesStore = useCategoriesStore()

const showCreateModal = ref(false)
const editTarget = ref<{ id: string; name: string } | null>(null)
const deleteTarget = ref<{ id: string; name: string } | null>(null)

onMounted(() => categoriesStore.fetchCategories())
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Categorias</h1>
          <p class="mt-1 text-sm text-gray-500">Organize suas tarefas por categorias</p>
        </div>
        <BaseButton @click="showCreateModal = true">
          <AppIcon name="PlusIcon" class="size-4" />
          Nova categoria
        </BaseButton>
      </div>

      <div v-if="categoriesStore.loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="h-24 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div
        v-else-if="categoriesStore.categories.length > 0"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="category in categoriesStore.categories"
          :key="category.id"
          class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <AppIcon name="FolderIcon" class="size-5 text-blue-600" />
              </div>
              <span class="truncate text-sm font-semibold text-gray-900">{{ category.name }}</span>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <button
                class="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                title="Editar"
                @click="editTarget = { id: category.id, name: category.name }"
              >
                <AppIcon name="PencilIcon" class="size-4" />
              </button>
              <button
                class="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                title="Excluir"
                @click="deleteTarget = { id: category.id, name: category.name }"
              >
                <AppIcon name="TrashIcon" class="size-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <AppIcon name="ClipboardCheckIcon" class="size-3.5" />
            <span>
              {{ category._count.tasks }}
              {{ category._count.tasks === 1 ? 'tarefa' : 'tarefas' }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center"
      >
        <AppIcon name="FolderIcon" class="mx-auto size-10 text-gray-300" />
        <p class="mt-3 text-sm font-medium text-gray-500">Nenhuma categoria criada</p>
        <p class="mt-1 text-xs text-gray-400">Crie uma categoria para organizar suas tarefas</p>
      </div>
    </div>

    <CreateCategoryModal :open="showCreateModal" @close="showCreateModal = false" />

    <EditCategoryModal
      :open="editTarget !== null"
      :category-id="editTarget?.id ?? null"
      :category-name="editTarget?.name ?? ''"
      @close="editTarget = null"
    />

    <DeleteCategoryModal
      :open="deleteTarget !== null"
      :category-id="deleteTarget?.id ?? null"
      :category-name="deleteTarget?.name ?? ''"
      @close="deleteTarget = null"
    />
  </AppLayout>
</template>
