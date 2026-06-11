<script setup lang="ts">
defineProps<{ modelValue: boolean | undefined }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="!!modelValue"
    class="relative inline-flex h-[22px] w-[38px] items-center rounded-full transition-colors duration-200 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 shrink-0"
    :class="modelValue ? 'bg-accent' : 'bg-surface-4'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      class="inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow transition-transform duration-200 ease-out-expo"
      :class="modelValue ? 'translate-x-[19px]' : 'translate-x-[3px]'"
    />
  </button>
</template>
