<script setup lang="ts">
/**
 * Renders the configurable controls for a field, driven entirely by its
 * registry definition. Writes straight into `field.config` (reactive).
 */
import { computed } from 'vue'
import type { Field, FieldOption } from '@/types'
import { getFieldDefinition } from '@/data/fieldDefinitions'
import { useBlueprintStore } from '@/stores/blueprints'
import FormRow from '@/components/ui/FormRow.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import OptionsEditor from './OptionsEditor.vue'

const props = defineProps<{ field: Field }>()

const store = useBlueprintStore()
const definition = computed(() => getFieldDefinition(props.field.type))

/** Other blueprints offered as Entries relation sources (by handle). */
const blueprintChoices = computed(() =>
  store.blueprints
    .filter((b) => b.id !== store.selectedBlueprintId)
    .map((b) => ({ value: b.handle, label: `${b.name} · ${b.handle}` })),
)

function set(key: string, value: unknown) {
  props.field.config[key] = value
}

function numberOrUndefined(v: string): number | undefined {
  if (v === '') return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}
</script>

<template>
  <div class="cq-grid-2 gap-x-4 gap-y-3.5">
    <template v-for="ctrl in definition.options" :key="ctrl.key">
      <div :class="['options', 'blueprint'].includes(ctrl.control) || ctrl.control === 'textarea' ? 'col-span-2' : ''">
        <!-- Switch sits inline with its label -->
        <FormRow
          v-if="ctrl.control === 'switch'"
          :label="ctrl.label"
          :help="ctrl.help"
          inline
        >
          <BaseSwitch
            :model-value="!!field.config[ctrl.key]"
            @update:model-value="(v) => set(ctrl.key, v)"
          />
        </FormRow>

        <FormRow v-else :label="ctrl.label" :help="ctrl.help">
          <BaseInput
            v-if="ctrl.control === 'text'"
            :model-value="field.config[ctrl.key] as string"
            :placeholder="ctrl.placeholder"
            @update:model-value="(v) => set(ctrl.key, v)"
          />
          <BaseTextarea
            v-else-if="ctrl.control === 'textarea'"
            :model-value="field.config[ctrl.key] as string"
            :placeholder="ctrl.placeholder"
            @update:model-value="(v) => set(ctrl.key, v)"
          />
          <BaseInput
            v-else-if="ctrl.control === 'number'"
            type="number"
            :model-value="field.config[ctrl.key] as number"
            :placeholder="ctrl.placeholder"
            @update:model-value="(v) => set(ctrl.key, numberOrUndefined(v))"
          />
          <BaseSelect
            v-else-if="ctrl.control === 'select'"
            :model-value="field.config[ctrl.key] as string"
            :options="ctrl.choices ?? []"
            @update:model-value="(v) => set(ctrl.key, v)"
          />
          <BaseSelect
            v-else-if="ctrl.control === 'blueprint'"
            :model-value="field.config[ctrl.key] as string"
            :options="blueprintChoices"
            placeholder="Select a blueprint…"
            @update:model-value="(v) => set(ctrl.key, v)"
          />
          <OptionsEditor
            v-else-if="ctrl.control === 'options'"
            :model-value="field.config[ctrl.key] as FieldOption[]"
            @update:model-value="(v) => set(ctrl.key, v)"
          />
        </FormRow>
      </div>
    </template>
  </div>
</template>
