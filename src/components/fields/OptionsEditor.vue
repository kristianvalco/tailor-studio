<script setup lang="ts">
/** Editor for dropdown-style `options` (value/label pairs). */
import { useI18n } from 'vue-i18n'
import type { FieldOption } from '@/types'
import { createId } from '@/utils/id'
import { slugifyFieldHandle } from '@/utils/handle'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Icon from '@/components/ui/Icon.vue'

const { t } = useI18n()
const props = defineProps<{ modelValue: FieldOption[] | undefined }>()
const emit = defineEmits<{ 'update:modelValue': [value: FieldOption[]] }>()

function update(list: FieldOption[]) {
  emit('update:modelValue', list)
}

function add() {
  update([...(props.modelValue ?? []), { id: createId('opt'), value: '', label: '' }])
}

function remove(id: string) {
  update((props.modelValue ?? []).filter((o) => o.id !== id))
}

function setLabel(opt: FieldOption, label: string) {
  const list = (props.modelValue ?? []).map((o) =>
    o.id === opt.id
      ? { ...o, label, value: o.value || slugifyFieldHandle(label) }
      : o,
  )
  update(list)
}

function setValue(opt: FieldOption, value: string) {
  update((props.modelValue ?? []).map((o) => (o.id === opt.id ? { ...o, value } : o)))
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="opt in modelValue ?? []"
      :key="opt.id"
      class="flex items-center gap-2"
    >
      <BaseInput
        :model-value="opt.value"
        :placeholder="t('optionsEditor.value')"
        mono
        class="flex-1"
        @update:model-value="(v) => setValue(opt, v)"
      />
      <BaseInput
        :model-value="opt.label"
        :placeholder="t('optionsEditor.label')"
        class="flex-1"
        @update:model-value="(v) => setLabel(opt, v)"
      />
      <button
        class="p-1.5 rounded-md text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
        @click="remove(opt.id)"
      >
        <Icon name="x" :size="14" />
      </button>
    </div>
    <BaseButton size="sm" variant="ghost" icon="plus" @click="add">{{ t('optionsEditor.addOption') }}</BaseButton>
  </div>
</template>
