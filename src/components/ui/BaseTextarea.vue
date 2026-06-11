<script setup lang="ts">
defineProps<{ modelValue: string | null | undefined; placeholder?: string; rows?: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <textarea
    :value="modelValue ?? ''"
    :placeholder="placeholder"
    :rows="rows ?? 3"
    class="w-full px-3 py-2 rounded-lg bg-surface-3 border border-border text-[13px] text-content-primary placeholder:text-content-muted transition-colors focus:outline-none focus:border-accent/60 focus:bg-surface-4 resize-y leading-relaxed"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
