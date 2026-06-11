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

/** Light counterpart, matching the light app surfaces. */
monaco.editor.defineTheme('tailor-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'type', foreground: '4f46e5' },
    { token: 'string', foreground: '15803d' },
    { token: 'number', foreground: 'b45309' },
    { token: 'comment', foreground: '8a8a9a', fontStyle: 'italic' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#1a1a22',
    'editorLineNumber.foreground': '#c4c4d0',
    'editorLineNumber.activeForeground': '#54546a',
    'editor.lineHighlightBackground': '#f3f3f7',
    'editor.selectionBackground': '#6366f126',
    'editorCursor.foreground': '#4f46e5',
    'editorGutter.background': '#ffffff',
  },
})

export { monaco }
