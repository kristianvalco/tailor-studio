<script setup lang="ts">
import type { Blueprint } from '@/types'
import Icon from '@/components/ui/Icon.vue'

defineProps<{ blueprint: Blueprint; active: boolean }>()
const emit = defineEmits<{ select: []; delete: [] }>()

const typeIcon: Record<string, string> = {
  single: 'box',
  structure: 'layers',
  stream: 'text',
  global: 'settings',
}
</script>

<template>
  <div
    class="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors"
    :class="active ? 'bg-accent-soft text-content-primary' : 'text-content-secondary hover:bg-white/5 hover:text-content-primary'"
    @click="emit('select')"
  >
    <Icon
      :name="typeIcon[blueprint.type] ?? 'box'"
      :size="16"
      :class="active ? 'text-accent' : 'text-content-muted'"
    />
    <span class="flex-1 truncate text-[13px] font-medium">{{ blueprint.name || 'Untitled' }}</span>
    <span class="text-[10px] uppercase tracking-wide text-content-muted opacity-0 group-hover:opacity-100">
      {{ blueprint.type }}
    </span>
    <button
      class="rounded p-0.5 text-content-muted opacity-0 transition hover:text-red-400 group-hover:opacity-100"
      title="Delete blueprint"
      @click.stop="emit('delete')"
    >
      <Icon name="trash-2" :size="13" />
    </button>
  </div>
</template>
