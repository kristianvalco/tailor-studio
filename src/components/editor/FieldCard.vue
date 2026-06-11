<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Field } from '@/types'
import { getFieldDefinition } from '@/data/fieldDefinitions'
import { useBlueprintStore } from '@/stores/blueprints'
import { useFieldI18n } from '@/composables/useFieldI18n'
import { slugifyFieldHandle } from '@/utils/handle'
import Icon from '@/components/ui/Icon.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import FormRow from '@/components/ui/FormRow.vue'
import FieldInspector from '@/components/fields/FieldInspector.vue'

const props = defineProps<{ field: Field }>()
const store = useBlueprintStore()
const { t } = useI18n()
const { typeLabel } = useFieldI18n()

const definition = computed(() => getFieldDefinition(props.field.type))
const expanded = computed(() => store.selectedFieldId === props.field.id)

function toggle() {
  store.selectField(expanded.value ? null : props.field.id)
}

function onLabelInput(value: string) {
  props.field.label = value
  // Auto-fill the handle while it tracks the label (empty or unchanged).
  if (!props.field.handle || props.field.handle === slugifyFieldHandle(prevLabel.value)) {
    props.field.handle = slugifyFieldHandle(value)
  }
  prevLabel.value = value
}

// Track the previous label to know whether the handle was hand-edited.
const prevLabel = ref(props.field.label)

const childCount = computed(() => props.field.fields?.length ?? 0)
</script>

<template>
  <div
    class="group rounded-xl border bg-surface-2 transition-colors"
    :class="expanded ? 'border-accent/40 shadow-panel' : 'border-border hover:border-border-strong'"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 px-3 py-2.5">
      <button
        class="drag-handle cursor-grab text-content-muted/50 hover:text-content-secondary transition-colors active:cursor-grabbing"
        :title="t('fieldActions.dragReorder')"
      >
        <Icon name="grip-vertical" :size="16" />
      </button>

      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 text-accent"
      >
        <Icon :name="definition.icon" :size="16" />
      </div>

      <button class="flex-1 min-w-0 text-left" @click="toggle">
        <div class="flex items-center gap-2">
          <span class="truncate text-[13px] font-medium text-content-primary">
            {{ field.label || t('editor.untitledField') }}
          </span>
          <span
            v-if="field.config.required"
            class="text-[10px] font-semibold text-accent"
            :title="t('fieldActions.required')"
          >●</span>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-content-muted">
          <code class="font-mono">{{ field.handle || '—' }}</code>
          <span>·</span>
          <span>{{ typeLabel(definition) }}</span>
          <template v-if="definition.nestable">
            <span>·</span>
            <span>{{ t('editor.fieldCount', { n: childCount }, childCount) }}</span>
          </template>
        </div>
      </button>

      <button
        v-if="definition.nestable"
        class="hidden group-hover:flex items-center gap-1 rounded-lg border border-border px-2.5 h-7 text-[11px] text-content-secondary hover:text-content-primary hover:border-border-strong transition-colors"
        @click="store.enterRepeater(field.id)"
      >
        {{ t('editor.editFields') }} <Icon name="chevron-right" :size="12" />
      </button>

      <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          class="p-1.5 rounded-md text-content-muted hover:text-content-primary hover:bg-hover transition-colors"
          :title="t('fieldActions.duplicate')"
          @click="store.duplicateField(field.id)"
        >
          <Icon name="copy" :size="15" />
        </button>
        <button
          class="p-1.5 rounded-md text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          :title="t('fieldActions.delete')"
          @click="store.removeField(field.id)"
        >
          <Icon name="trash-2" :size="15" />
        </button>
        <button
          class="p-1.5 rounded-md text-content-muted hover:text-content-primary hover:bg-hover transition-colors"
          :title="expanded ? t('fieldActions.collapse') : t('fieldActions.configure')"
          @click="toggle"
        >
          <Icon name="chevron-down" :size="16" :class="expanded && 'rotate-180'" class="transition-transform" />
        </button>
      </div>
    </div>

    <!-- Inspector -->
    <Transition name="expand">
      <div v-if="expanded" class="border-t border-border-subtle px-4 pb-4 pt-4">
        <div class="mb-4 cq-grid-2 gap-4">
          <FormRow :label="t('editor.fieldLabel')">
            <BaseInput :model-value="field.label" placeholder="Title" @update:model-value="onLabelInput" />
          </FormRow>
          <FormRow :label="t('editor.handle')">
            <BaseInput
              :model-value="field.handle"
              placeholder="title"
              mono
              @update:model-value="(v) => (field.handle = v)"
            />
          </FormRow>
        </div>
        <FieldInspector :field="field" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
