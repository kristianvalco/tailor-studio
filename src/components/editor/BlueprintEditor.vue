<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlueprintStore } from '@/stores/blueprints'
import { getFieldDefinition } from '@/data/fieldDefinitions'
import GeneralSettings from './GeneralSettings.vue'
import FieldsSection from './FieldsSection.vue'
import Icon from '@/components/ui/Icon.vue'

const store = useBlueprintStore()
const { t } = useI18n()
const blueprint = computed(() => store.selectedBlueprint)

const typeBadge = computed(() =>
  blueprint.value ? t(`blueprintTypes.${blueprint.value.type}`) : '',
)

const navIcon = computed(() => {
  // Map an entered field type to an editor icon if it happens to match.
  const t = blueprint.value?.fields[0]?.type
  return t ? getFieldDefinition(t).icon : 'box'
})
</script>

<template>
  <div v-if="blueprint" class="flex h-full flex-col">
    <!-- Editor header (also a window drag handle) -->
    <header data-tauri-drag-region class="flex items-center gap-3 border-b border-border-subtle px-6 py-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Icon :name="navIcon" :size="18" />
      </div>
      <div class="min-w-0">
        <h1 class="truncate text-[15px] font-semibold text-content-primary">
          {{ blueprint.name || 'Untitled' }}
        </h1>
        <code class="text-[11px] text-content-muted">{{ blueprint.handle || '—' }}</code>
      </div>
      <span class="ml-auto rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-content-secondary">
        {{ typeBadge }}
      </span>
    </header>

    <!-- Scrollable body -->
    <div class="cq min-h-0 flex-1 overflow-y-auto px-6 py-6">
      <div class="mx-auto max-w-2xl space-y-8">
        <GeneralSettings :blueprint="blueprint" />
        <div class="h-px bg-border-subtle" />
        <FieldsSection />
      </div>
    </div>
  </div>

  <!-- No selection -->
  <div v-else class="flex h-full flex-col items-center justify-center gap-3 text-content-muted">
    <Icon name="box" :size="40" :stroke-width="1.5" />
    <p class="text-[13px]">{{ t('editor.selectPrompt') }}</p>
  </div>
</template>
