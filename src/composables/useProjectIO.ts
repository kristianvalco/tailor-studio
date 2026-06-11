/**
 * File / clipboard I/O. Runs natively through Tauri plugins when available and
 * transparently falls back to browser APIs (download blob, navigator.clipboard)
 * so the app is fully usable in `vite dev` too.
 */
import { useBlueprintStore } from '@/stores/blueprints'
import { useProjectStore } from '@/stores/projects'
import { useUiStore } from '@/stores/ui'
import { generateYaml } from '@/generator/yamlGenerator'
import { t } from '@/i18n'

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

export function useProjectIO() {
  const store = useBlueprintStore()
  const projects = useProjectStore()
  const ui = useUiStore()

  async function copyYaml() {
    const yaml = store.yaml
    if (!yaml) return
    try {
      await navigator.clipboard.writeText(yaml)
      ui.notify(t('toast.copied'), 'success')
    } catch {
      ui.notify(t('toast.clipboardFail'), 'error')
    }
  }

  function suggestedName(): string {
    const handle = store.selectedBlueprint?.handle || 'blueprint'
    return handle.split('\\').pop()!.toLowerCase() + '.yaml'
  }

  async function exportYaml() {
    const bp = store.selectedBlueprint
    if (!bp) return
    const yaml = generateYaml(bp)

    if (isTauri()) {
      const { save } = await import('@tauri-apps/plugin-dialog')
      const { writeTextFile } = await import('@tauri-apps/plugin-fs')
      const path = await save({ defaultPath: suggestedName(), filters: [{ name: 'YAML', extensions: ['yaml', 'yml'] }] })
      if (!path) return
      await writeTextFile(path, yaml)
      ui.notify(t('toast.exported'), 'success')
      return
    }

    downloadBlob(yaml, suggestedName())
    ui.notify(t('toast.downloaded'), 'success')
  }

  async function importYaml() {
    if (isTauri()) {
      const { open } = await import('@tauri-apps/plugin-dialog')
      const { readTextFile } = await import('@tauri-apps/plugin-fs')
      const selected = await open({ filters: [{ name: 'YAML', extensions: ['yaml', 'yml'] }] })
      if (!selected || Array.isArray(selected)) return
      const text = await readTextFile(selected)
      applyImport(text)
      return
    }
    pickFile(applyImport)
  }

  function applyImport(text: string) {
    const error = store.importYaml(text)
    ui.notify(error ?? t('toast.imported'), error ? 'error' : 'success')
  }

  async function saveProject() {
    // Export the active project (name + all blueprints) as a JSON snapshot.
    const project = projects.activeProject
    if (!project) return
    const snapshot = JSON.stringify({ name: project.name, blueprints: project.blueprints }, null, 2)
    const filename = `${project.name.replace(/\s+/g, '-').toLowerCase()}.tailor.json`
    if (isTauri()) {
      const { save } = await import('@tauri-apps/plugin-dialog')
      const { writeTextFile } = await import('@tauri-apps/plugin-fs')
      const path = await save({ defaultPath: filename, filters: [{ name: 'JSON', extensions: ['json'] }] })
      if (!path) return
      await writeTextFile(path, snapshot)
      ui.notify(t('toast.projectSaved'), 'success')
      return
    }
    downloadBlob(snapshot, filename)
    ui.notify(t('toast.projectSaved'), 'success')
  }

  return { copyYaml, exportYaml, importYaml, saveProject }
}

function downloadBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function pickFile(onText: (text: string) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.yaml,.yml'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onText(String(reader.result))
    reader.readAsText(file)
  }
  input.click()
}
