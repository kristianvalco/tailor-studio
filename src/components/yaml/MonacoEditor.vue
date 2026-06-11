<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { monaco } from './monaco'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const themeName = computed(() => (settings.isDark ? 'tailor-dark' : 'tailor-light'))

const props = withDefaults(
  defineProps<{ modelValue: string; language?: string; readonly?: boolean }>(),
  { language: 'yaml', readonly: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const host = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let suppress = false

onMounted(() => {
  if (!host.value) return
  editor = monaco.editor.create(host.value, {
    value: props.modelValue,
    language: props.language,
    theme: themeName.value,
    readOnly: props.readonly,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 12.5,
    fontFamily: 'SF Mono, JetBrains Mono, Menlo, monospace',
    lineNumbersMinChars: 3,
    scrollBeyondLastLine: false,
    padding: { top: 14, bottom: 14 },
    renderLineHighlight: 'line',
    smoothScrolling: true,
    tabSize: 4,
    guides: { indentation: false },
    overviewRulerLanes: 0,
    scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
  })

  editor.onDidChangeModelContent(() => {
    if (suppress) return
    emit('update:modelValue', editor!.getValue())
  })
})

// Push external changes in without clobbering the cursor on local edits.
watch(
  () => props.modelValue,
  (value) => {
    if (!editor || value === editor.getValue()) return
    suppress = true
    editor.setValue(value)
    suppress = false
  },
)

// Re-theme Monaco when the app theme changes.
watch(themeName, (name) => monaco.editor.setTheme(name))

onBeforeUnmount(() => editor?.dispose())
</script>

<template>
  <div ref="host" class="h-full w-full" />
</template>
