<script setup lang="ts">
import { ref } from 'vue'
import type { BlueprintType } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'

const emit = defineEmits<{ create: [type: BlueprintType] }>()
const open = ref(false)

const types: { value: BlueprintType; label: string; icon: string; hint: string }[] = [
  { value: 'single', label: 'Single', icon: 'box', hint: 'One standalone record' },
  { value: 'structure', label: 'Structure', icon: 'layers', hint: 'Nested tree of entries' },
  { value: 'stream', label: 'Stream', icon: 'text', hint: 'Flat, dated list' },
  { value: 'global', label: 'Global', icon: 'settings', hint: 'Site-wide settings' },
]

function create(type: BlueprintType) {
  emit('create', type)
  open.value = false
}
</script>

<template>
  <div class="relative">
    <BaseButton variant="subtle" icon="plus" block @click="open = !open">New Blueprint</BaseButton>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute bottom-full left-0 z-30 mb-2 w-full origin-bottom rounded-2xl border border-border bg-surface-2/95 backdrop-blur-xl shadow-pop overflow-hidden p-1.5"
      >
        <button
          v-for="t in types"
          :key="t.value"
          class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
          @click="create(t.value)"
        >
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 text-accent">
            <Icon :name="t.icon" :size="16" />
          </span>
          <span>
            <span class="block text-[13px] font-medium text-content-primary">{{ t.label }}</span>
            <span class="block text-[11px] text-content-muted">{{ t.hint }}</span>
          </span>
        </button>
      </div>
    </Transition>
    <div v-if="open" class="fixed inset-0 z-20" @click="open = false" />
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(4px);
}
</style>
