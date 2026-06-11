<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import Icon from '@/components/ui/Icon.vue'

const ui = useUiStore()
const icons = { info: 'sparkles', success: 'check-square', error: 'x' } as const
</script>

<template>
  <Transition name="toast">
    <div
      v-if="ui.toast"
      class="pointer-events-none fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] shadow-pop backdrop-blur-xl"
      :class="{
        'border-border bg-surface-3/90 text-content-primary': ui.toast.tone === 'info',
        'border-emerald-500/30 bg-emerald-950/80 text-emerald-200': ui.toast.tone === 'success',
        'border-red-500/30 bg-red-950/80 text-red-200': ui.toast.tone === 'error',
      }"
    >
      <Icon :name="icons[ui.toast.tone]" :size="15" />
      {{ ui.toast.message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
