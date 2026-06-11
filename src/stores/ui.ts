/** UI-only state: which right-panel tab is active, transient toasts, etc. */
import { defineStore } from 'pinia'

export type RightTab = 'preview' | 'yaml'

interface State {
  rightTab: RightTab
  toast: { message: string; tone: 'info' | 'success' | 'error' } | null
}

export const useUiStore = defineStore('ui', {
  state: (): State => ({
    rightTab: 'preview',
    toast: null,
  }),
  actions: {
    setRightTab(tab: RightTab) {
      this.rightTab = tab
    },
    notify(message: string, tone: 'info' | 'success' | 'error' = 'info') {
      this.toast = { message, tone }
      window.setTimeout(() => {
        if (this.toast?.message === message) this.toast = null
      }, 2400)
    },
  },
})
