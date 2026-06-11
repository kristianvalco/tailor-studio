<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldDefinition, FieldType } from '@/types'
import { fieldDefinitions } from '@/data/fieldDefinitions'
import { useFieldI18n } from '@/composables/useFieldI18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'

const emit = defineEmits<{ add: [type: FieldType] }>()
const { t } = useI18n()
const { typeLabel, typeDescription, categoryLabel } = useFieldI18n()

const open = ref(false)
const query = ref('')

const categoryFallback: Record<FieldDefinition['category'], string> = {
  basic: 'Basic',
  rich: 'Rich content',
  choice: 'Choice',
  media: 'Media',
  relational: 'Relational',
  layout: 'Layout',
}

const grouped = computed(() => {
  const q = query.value.trim().toLowerCase()
  const matches = fieldDefinitions.filter(
    (d) =>
      !q ||
      typeLabel(d).toLowerCase().includes(q) ||
      typeDescription(d).toLowerCase().includes(q) ||
      d.label.toLowerCase().includes(q),
  )
  const groups = new Map<FieldDefinition['category'], FieldDefinition[]>()
  for (const def of matches) {
    if (!groups.has(def.category)) groups.set(def.category, [])
    groups.get(def.category)!.push(def)
  }
  return groups
})

function pick(type: FieldType) {
  emit('add', type)
  open.value = false
  query.value = ''
}

function close() {
  open.value = false
  query.value = ''
}
</script>

<template>
  <div class="relative">
    <BaseButton variant="primary" icon="plus" @click="open = !open">{{ t('editor.addField') }}</BaseButton>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 z-30 mt-2 w-80 origin-top-right rounded-2xl border border-border bg-surface-2/95 backdrop-blur-xl shadow-pop overflow-hidden"
      >
        <div class="border-b border-border-subtle p-2">
          <div class="flex items-center gap-2 rounded-lg bg-surface-3 px-2.5">
            <Icon name="search" :size="14" class="text-content-muted" />
            <input
              v-model="query"
              autofocus
              :placeholder="t('addFieldMenu.search')"
              class="h-9 w-full bg-transparent text-[13px] text-content-primary placeholder:text-content-muted focus:outline-none"
            />
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto p-2">
          <template v-for="[category, defs] in grouped" :key="category">
            <div class="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-content-muted">
              {{ categoryLabel(category, categoryFallback[category]) }}
            </div>
            <button
              v-for="def in defs"
              :key="def.type"
              class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-hover"
              @click="pick(def.type)"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 text-accent">
                <Icon :name="def.icon" :size="16" />
              </span>
              <span class="min-w-0">
                <span class="block text-[13px] font-medium text-content-primary">{{ typeLabel(def) }}</span>
                <span class="block truncate text-[11px] text-content-muted">{{ typeDescription(def) }}</span>
              </span>
            </button>
          </template>
          <p v-if="!grouped.size" class="px-2 py-6 text-center text-[12px] text-content-muted">
            {{ t('addFieldMenu.noMatch', { q: query }) }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- click-away backdrop -->
    <div v-if="open" class="fixed inset-0 z-20" @click="close" />
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
  transform: scale(0.96) translateY(-4px);
}
</style>
