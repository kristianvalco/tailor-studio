/**
 * User preferences: color theme and UI language. Persisted to localStorage and
 * applied to the document (and exposed to vue-i18n via the app bootstrap).
 */
import { defineStore } from 'pinia'

export type ThemePref = 'dark' | 'light' | 'system'
export type Locale = 'en' | 'sk'

const STORAGE_KEY = 'tailor-studio:settings:v1'

interface State {
  theme: ThemePref
  locale: Locale
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<State>
      return {
        theme: p.theme === 'light' || p.theme === 'system' ? p.theme : 'dark',
        locale: p.locale === 'sk' ? 'sk' : 'en',
      }
    }
  } catch {
    /* ignore */
  }
  return { theme: 'dark', locale: 'en' }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
}

/** Whether the dark palette should currently be active. */
function resolveDark(theme: ThemePref): boolean {
  if (theme === 'system') return systemPrefersDark()
  return theme === 'dark'
}

export const useSettingsStore = defineStore('settings', {
  state: (): State => load(),

  getters: {
    /** Effective dark/light, resolving `system`. */
    isDark(state): boolean {
      return resolveDark(state.theme)
    },
  },

  actions: {
    setTheme(theme: ThemePref) {
      this.theme = theme
      this.applyTheme()
      this.persist()
    },

    setLocale(locale: Locale) {
      this.locale = locale
      this.persist()
    },

    /** Toggle the `.dark` class on <html> to match the resolved theme. */
    applyTheme() {
      document.documentElement.classList.toggle('dark', resolveDark(this.theme))
    },

    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: this.theme, locale: this.locale }))
      } catch {
        /* ignore */
      }
    },
  },
})

/**
 * Keep `system` theme in sync with OS changes. Call once at app start; it
 * re-applies the theme whenever the OS preference flips (only matters in
 * `system` mode).
 */
export function watchSystemTheme(apply: () => void) {
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', apply)
}
