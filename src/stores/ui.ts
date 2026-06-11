/** UI-only state: which right-panel tab is active, transient toasts, etc. */
import { defineStore } from 'pinia'

export type RightTab = 'preview' | 'yaml'

interface State {
  rightTab: RightTab
  settingsOpen: boolean
  templatesOpen: boolean
  toast: { message: string; tone: 'info' | 'success' | 'error' } | null
}

export const useUiStore = defineStore('ui', {
  state: (): State => ({
    rightTab: 'preview',
    settingsOpen: false,
    templatesOpen: false,
    toast: null,
  }),
  actions: {
    setRightTab(tab: RightTab) {
      this.rightTab = tab
    },
    openSettings() {
      this.settingsOpen = true
    },
    closeSettings() {
      this.settingsOpen = false
    },
    openTemplates() {
      this.templatesOpen = true
    },
    closeTemplates() {
      this.templatesOpen = false
    },
    notify(message: string, tone: 'info' | 'success' | 'error' = 'info') {
      this.toast = { message, tone }
      window.setTimeout(() => {
        if (this.toast?.message === message) this.toast = null
      }, 2400)
    },
  },
})
