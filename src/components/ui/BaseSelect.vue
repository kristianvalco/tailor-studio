<script setup lang="ts">
import Icon from './Icon.vue'

defineProps<{
  modelValue: string | null | undefined
  options: { value: string; label: string }[]
  placeholder?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue ?? ''"
      class="w-full h-9 pl-3 pr-9 rounded-lg bg-surface-3 border border-border text-[13px] text-content-primary appearance-none cursor-pointer transition-colors focus:outline-none focus:border-accent/60 focus:bg-surface-4"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <Icon
      name="chevron-down"
      :size="14"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
    />
  </div>
</template>
