import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { i18n } from '@/i18n'
import { useProjectStore } from '@/stores/projects'
import { useSettingsStore, watchSystemTheme } from '@/stores/settings'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(i18n)

// --- Settings: apply theme + language before mount, then keep in sync ---------
const settings = useSettingsStore(pinia)
settings.applyTheme()
i18n.global.locale.value = settings.locale
watchSystemTheme(() => settings.applyTheme())
watch(
  () => settings.locale,
  (loc) => (i18n.global.locale.value = loc),
)

// --- Persistence: debounced autosave of projects -----------------------------
const projects = useProjectStore(pinia)
let saveTimer: number | undefined
projects.$subscribe(() => {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => projects.persist(), 300)
})

app.mount('#app')
