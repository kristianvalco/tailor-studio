<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Field } from '@/types'
import { useBlueprintStore } from '@/stores/blueprints'
import PreviewField from './PreviewField.vue'
import Icon from '@/components/ui/Icon.vue'

const store = useBlueprintStore()
const { t } = useI18n()
const blueprint = computed(() => store.selectedBlueprint)

/** Group fields by their `tab` to mimic the backend's tabbed form. */
const tabs = computed(() => {
  const fields = blueprint.value?.fields ?? []
  const map = new Map<string, Field[]>()
  for (const f of fields) {
    const tab = (f.config.tab as string) || 'Primary'
    if (!map.has(tab)) map.set(tab, [])
    map.get(tab)!.push(f)
  }
  return [...map.entries()]
})

function spanClass(field: Field): string {
  const span = field.config.span as string
  if (field.type === 'section') return 'col-span-2'
  return span === 'left' || span === 'right' ? 'col-span-1' : 'col-span-2'
}
</script>

<template>
  <div v-if="blueprint" class="cq h-full overflow-y-auto bg-surface-0/40 p-5">
    <div class="mx-auto max-w-xl">
      <!-- Faux backend window -->
      <div class="overflow-hidden rounded-xl border border-border bg-surface-2 shadow-panel">
        <div class="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
          <Icon name="box" :size="15" class="text-accent" />
          <span class="text-[13px] font-semibold text-content-primary">{{ blueprint.name || 'Untitled' }}</span>
          <span class="ml-auto text-[11px] text-content-muted">{{ t('preview.backend') }}</span>
        </div>

        <div v-for="[tab, fields] in tabs" :key="tab" class="px-5 py-4">
          <div v-if="tabs.length > 1" class="mb-3 inline-flex rounded-lg bg-surface-3 px-3 py-1 text-[12px] font-medium text-content-secondary">
            {{ tab }}
          </div>
          <div class="cq-grid-2 gap-x-4 gap-y-4">
            <div v-for="field in fields" :key="field.id" :class="spanClass(field)">
              <PreviewField :field="field" />
            </div>
          </div>
        </div>

        <div v-if="!blueprint.fields.length" class="px-5 py-10 text-center text-[12px] text-content-muted">
          {{ t('preview.addFields') }}
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex h-full items-center justify-center text-[13px] text-content-muted">
    {{ t('preview.nothing') }}
  </div>
</template>
