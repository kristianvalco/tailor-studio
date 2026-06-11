<script setup lang="ts">
defineProps<{ label?: string; help?: string; inline?: boolean }>()
</script>

<template>
  <label
    class="block"
    :class="inline && 'flex items-center justify-between gap-3'"
  >
    <span
      v-if="label"
      class="block text-[11px] font-medium uppercase tracking-wide text-content-muted"
      :class="inline ? 'mb-0' : 'mb-1.5'"
    >
      {{ label }}
    </span>
    <div :class="inline && 'shrink-0'">
      <slot />
    </div>
    <span v-if="help && !inline" class="mt-1 block text-[11px] text-content-muted/80">{{ help }}</span>
  </label>
</template>
