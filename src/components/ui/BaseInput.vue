<script setup lang="ts">
defineProps<{
  modelValue: string | number | null | undefined
  placeholder?: string
  type?: string
  mono?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    :type="type ?? 'text'"
    :value="modelValue ?? ''"
    :placeholder="placeholder"
    class="w-full h-9 px-3 rounded-lg bg-surface-3 border border-border text-[13px] text-content-primary placeholder:text-content-muted transition-colors focus:outline-none focus:border-accent/60 focus:bg-surface-4"
    :class="mono && 'font-mono'"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
