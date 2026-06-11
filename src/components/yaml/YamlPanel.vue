<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useBlueprintStore } from '@/stores/blueprints'
import { parseYaml } from '@/parser/yamlParser'
import MonacoEditor from './MonacoEditor.vue'
import Icon from '@/components/ui/Icon.vue'

const store = useBlueprintStore()

// Local buffer that mirrors generated YAML but accepts live hand-edits.
const draft = ref(store.yaml)
const error = ref<string | null>(null)
let editingLocally = false

// Regenerate the buffer when the model changes (and we're not mid-edit).
watch(
  () => store.yaml,
  (yaml) => {
    if (editingLocally) return
    draft.value = yaml
    error.value = null
  },
)

const bpId = computed(() => store.selectedBlueprintId)
watch(bpId, () => {
  draft.value = store.yaml
  error.value = null
})

let timer: number | undefined
function onEdit(value: string) {
  draft.value = value
  editingLocally = true
  window.clearTimeout(timer)
  // Debounce: validate & sync back into the model after a short pause.
  timer = window.setTimeout(() => {
    const { blueprint, error: err } = parseYaml(value)
    if (err || !blueprint) {
      error.value = err ?? 'Invalid blueprint'
    } else {
      error.value = null
      const current = store.selectedBlueprint
      if (current) {
        blueprint.id = current.id
        Object.assign(current, blueprint)
      }
    }
    editingLocally = false
  }, 500)
}
</script>

<template>
  <div class="relative flex h-full flex-col">
    <MonacoEditor :model-value="draft" language="yaml" @update:model-value="onEdit" />

    <Transition name="slide-up">
      <div
        v-if="error"
        class="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/70 px-3 py-2 text-[12px] text-red-300 backdrop-blur"
      >
        <Icon name="x" :size="14" />
        <span class="truncate">{{ error }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
