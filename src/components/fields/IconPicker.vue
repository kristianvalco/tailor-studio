<script setup lang="ts">
/** Searchable visual picker for an OctoberCMS navigation icon class. */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { octoberIcons } from '@/data/octoberIcons'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps<{ modelValue: string | null | undefined }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { t } = useI18n()
const open = ref(false)
const query = ref('')

const current = computed(() => octoberIcons.find((i) => i.value === props.modelValue))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return octoberIcons
  return octoberIcons.filter(
    (i) =>
      i.value.toLowerCase().includes(q) ||
      i.label.toLowerCase().includes(q) ||
      (i.terms ?? '').toLowerCase().includes(q),
  )
})

// Allow free-form october classes not in our curated set.
const customValue = computed(() => {
  const q = query.value.trim()
  return q && !octoberIcons.some((i) => i.value === q || i.label.toLowerCase() === q.toLowerCase())
    ? (q.startsWith('icon-') ? q : `icon-${q}`)
    : null
})

function pick(value: string) {
  emit('update:modelValue', value)
  open.value = false
  query.value = ''
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative">
    <!-- Trigger -->
    <button
      type="button"
      class="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-surface-3 px-2.5 text-[13px] text-content-primary transition-colors hover:bg-surface-4"
      @click="open = !open"
    >
      <span class="flex h-6 w-6 items-center justify-center rounded-md bg-surface-1 text-accent">
        <span v-if="current" v-html="`<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${current.svg}</svg>`" />
        <Icon v-else name="search" :size="13" class="text-content-muted" />
      </span>
      <span class="flex-1 truncate text-left font-mono text-[12px]" :class="!modelValue && 'text-content-muted'">
        {{ modelValue || t('iconPicker.placeholder') }}
      </span>
      <button v-if="modelValue" type="button" class="text-content-muted hover:text-content-primary" :title="t('iconPicker.clear')" @click.stop="clear">
        <Icon name="x" :size="14" />
      </button>
      <Icon name="chevron-down" :size="14" class="text-content-muted" />
    </button>

    <!-- Popover -->
    <Transition name="pop">
      <div
        v-if="open"
        class="absolute left-0 right-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-2xl border border-border bg-surface-2/95 shadow-pop backdrop-blur-xl"
      >
        <div class="border-b border-border-subtle p-2">
          <div class="flex items-center gap-2 rounded-lg bg-surface-3 px-2.5">
            <Icon name="search" :size="14" class="text-content-muted" />
            <input
              v-model="query"
              autofocus
              :placeholder="t('iconPicker.search')"
              class="h-9 w-full bg-transparent text-[13px] text-content-primary placeholder:text-content-muted focus:outline-none"
            />
          </div>
        </div>

        <div class="max-h-64 overflow-y-auto p-2">
          <div class="grid grid-cols-6 gap-1.5">
            <button
              v-for="ic in filtered"
              :key="ic.value"
              type="button"
              class="flex aspect-square items-center justify-center rounded-lg border transition-colors"
              :class="ic.value === modelValue ? 'border-accent/50 bg-accent-soft text-accent' : 'border-transparent text-content-secondary hover:bg-hover hover:text-content-primary'"
              :title="`${ic.label} · ${ic.value}`"
              @click="pick(ic.value)"
            >
              <span v-html="`<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${ic.svg}</svg>`" />
            </button>
          </div>

          <!-- Use a custom october class -->
          <button
            v-if="customValue"
            type="button"
            class="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[12px] text-content-secondary transition-colors hover:bg-hover hover:text-content-primary"
            @click="pick(customValue)"
          >
            <Icon name="plus" :size="14" />
            <span>Use <code class="font-mono text-accent">{{ customValue }}</code></span>
          </button>
          <p v-else-if="!filtered.length" class="px-2 py-6 text-center text-[12px] text-content-muted">
            {{ t('iconPicker.noMatch') }}
          </p>
        </div>
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
  transform: scale(0.97) translateY(-4px);
}
</style>
