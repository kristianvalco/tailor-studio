<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'subtle' | 'danger'
    size?: 'sm' | 'md'
    icon?: string
    block?: boolean
  }>(),
  { variant: 'subtle', size: 'md', block: false },
)
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 ease-out-expo select-none active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-40 disabled:pointer-events-none"
    :class="[
      size === 'sm' ? 'text-xs px-2.5 h-7' : 'text-[13px] px-3.5 h-9',
      block && 'w-full',
      variant === 'primary' && 'bg-accent text-white hover:bg-accent-hover shadow-sm',
      variant === 'subtle' && 'bg-surface-3 text-content-primary hover:bg-surface-4 border border-border',
      variant === 'ghost' && 'text-content-secondary hover:text-content-primary hover:bg-white/5',
      variant === 'danger' && 'text-red-400 hover:bg-red-500/10',
    ]"
  >
    <Icon v-if="icon" :name="icon" :size="size === 'sm' ? 14 : 16" />
    <slot />
  </button>
</template>
