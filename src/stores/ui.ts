/** UI-only state: which right-panel tab is active, transient toasts, etc. */
import { defineStore } from 'pinia'

export type RightTab = 'preview' | 'yaml'
/** Which single pane is visible in the mobile (single-pane) layout. */
export type MobileView = 'list' | 'editor' | 'right'

interface State {
  rightTab: RightTab
  mobileView: MobileView
  settingsOpen: boolean
  templatesOpen: boolean
  toast: { message: string; tone: 'info' | 'success' | 'error' } | null
}

export const useUiStore = defineStore('ui', {
  state: (): State => ({
    rightTab: 'preview',
    mobileView: 'list',
    settingsOpen: false,
    templatesOpen: false,
    toast: null,
  }),
  actions: {
    setRightTab(tab: RightTab) {
      this.rightTab = tab
    },
    setMobileView(view: MobileView) {
      this.mobileView = view
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
