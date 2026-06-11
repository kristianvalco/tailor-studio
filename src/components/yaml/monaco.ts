/**
 * Monaco bootstrap for Vite. We only need the core editor worker — YAML is
 * highlighted by Monaco's built-in basic-language tokenizer, no language
 * service worker required.
 */
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker()
  },
}

/** A calm, on-brand dark theme matching the app surfaces. */
monaco.editor.defineTheme('tailor-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'type', foreground: '7c7ff5' },
    { token: 'string', foreground: 'a5d6a7' },
    { token: 'number', foreground: 'f5c177' },
    { token: 'comment', foreground: '6e6e80', fontStyle: 'italic' },
  ],
  colors: {
    'editor.background': '#0b0b0f',
    'editor.foreground': '#f4f4f6',
    'editorLineNumber.foreground': '#3a3a48',
    'editorLineNumber.activeForeground': '#a3a3b2',
    'editor.lineHighlightBackground': '#17171f',
    'editor.selectionBackground': '#6366f133',
    'editorCursor.foreground': '#7c7ff5',
    'editorGutter.background': '#0b0b0f',
  },
})

export { monaco }
