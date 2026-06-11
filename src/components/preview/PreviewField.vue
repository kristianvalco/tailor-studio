<script setup lang="ts">
/** Renders one field as an approximate OctoberCMS backend form control. */
import { computed } from 'vue'
import type { Field, FieldOption } from '@/types'
import { getFieldDefinition } from '@/data/fieldDefinitions'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps<{ field: Field }>()
const def = computed(() => getFieldDefinition(props.field.type))
const options = computed(() => (props.field.config.options as FieldOption[] | undefined) ?? [])
</script>

<template>
  <div>
    <!-- Section is a divider, not a labelled control -->
    <div v-if="field.type === 'section'" class="pt-2">
      <div class="mb-1 text-[12px] font-semibold uppercase tracking-wide text-content-secondary">
        {{ field.label }}
      </div>
      <div class="h-px bg-border" />
      <p v-if="field.config.comment" class="mt-1 text-[11px] text-content-muted">{{ field.config.comment }}</p>
    </div>

    <template v-else>
      <label class="mb-1.5 flex items-center gap-1 text-[12px] font-medium text-content-secondary">
        {{ field.label || field.handle }}
        <span v-if="field.config.required" class="text-red-400">*</span>
      </label>

      <!-- Text-like -->
      <div
        v-if="['text', 'number', 'colorpicker', 'datepicker'].includes(field.type)"
        class="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-1 px-3 text-[12px] text-content-muted"
      >
        <Icon v-if="field.type === 'datepicker'" name="calendar" :size="14" />
        <span
          v-if="field.type === 'colorpicker'"
          class="h-4 w-4 rounded border border-border"
          :style="{ background: (field.config.default as string) || '#6366f1' }"
        />
        {{ field.config.placeholder || (field.config.default as string) || '' }}
      </div>

      <!-- Textarea / rich / markdown / code -->
      <div
        v-else-if="['textarea', 'richeditor', 'markdown', 'codeeditor'].includes(field.type)"
        class="rounded-lg border border-border bg-surface-1"
      >
        <div v-if="['richeditor', 'markdown', 'codeeditor'].includes(field.type)" class="flex gap-1 border-b border-border-subtle px-2 py-1.5">
          <span v-for="i in 4" :key="i" class="h-4 w-4 rounded bg-surface-3" />
        </div>
        <div class="px-3 py-2 text-[12px] text-content-muted" :class="field.type === 'codeeditor' && 'font-mono'">
          {{ field.config.placeholder || '' }}
          <div class="h-10" />
        </div>
      </div>

      <!-- Switch / checkbox -->
      <div v-else-if="['switch', 'checkbox'].includes(field.type)" class="flex items-center gap-2">
        <span
          v-if="field.type === 'switch'"
          class="inline-flex h-[20px] w-[34px] items-center rounded-full bg-surface-4 px-0.5"
        >
          <span class="h-[15px] w-[15px] rounded-full bg-content-muted" />
        </span>
        <span v-else class="h-4 w-4 rounded border border-border bg-surface-1" />
        <span class="text-[12px] text-content-muted">{{ field.config.comment || field.label }}</span>
      </div>

      <!-- Dropdown -->
      <div
        v-else-if="field.type === 'dropdown'"
        class="flex h-9 items-center justify-between rounded-lg border border-border bg-surface-1 px-3 text-[12px] text-content-muted"
      >
        <span>{{ options[0]?.label || 'Select…' }}</span>
        <Icon name="chevron-down" :size="14" />
      </div>

      <!-- Media / file -->
      <div
        v-else-if="['mediafinder', 'fileupload'].includes(field.type)"
        class="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-surface-1 text-content-muted"
      >
        <Icon :name="field.type === 'mediafinder' ? 'image' : 'upload'" :size="18" />
        <span class="text-[11px]">{{ field.type === 'mediafinder' ? 'Choose from library' : 'Upload file' }}</span>
      </div>

      <!-- Entries -->
      <div
        v-else-if="field.type === 'entries'"
        class="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-1 px-3 text-[12px] text-content-muted"
      >
        <Icon name="link" :size="14" />
        <span>{{ field.config.source || 'Related blueprint' }}</span>
        <span class="ml-auto rounded bg-surface-3 px-1.5 py-0.5 text-[10px]">{{ field.config.displayMode || 'relation' }}</span>
      </div>

      <!-- Repeater -->
      <div v-else-if="field.type === 'repeater'" class="rounded-lg border border-border bg-surface-1 p-2">
        <div class="space-y-1.5">
          <div
            v-for="child in field.fields ?? []"
            :key="child.id"
            class="flex items-center gap-2 rounded-md bg-surface-2 px-2.5 py-1.5 text-[11px] text-content-muted"
          >
            <Icon :name="getFieldDefinition(child.type).icon" :size="12" />
            {{ child.label || child.handle }}
          </div>
        </div>
        <div class="mt-2 flex items-center gap-1 text-[11px] text-accent">
          <Icon name="plus" :size="12" /> {{ (field.config.prompt as string) || 'Add item' }}
        </div>
      </div>

      <!-- Partial / fallback -->
      <div v-else class="rounded-lg border border-dashed border-border bg-surface-1 px-3 py-2 text-[11px] text-content-muted">
        {{ def.label }} <span v-if="field.config.path" class="font-mono">· {{ field.config.path }}</span>
      </div>

      <p v-if="field.config.comment && !['switch', 'checkbox', 'section'].includes(field.type)" class="mt-1 text-[11px] text-content-muted/80">
        {{ field.config.comment }}
      </p>
    </template>
  </div>
</template>
