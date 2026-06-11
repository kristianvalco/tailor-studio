import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { useProjectStore } from '@/stores/projects'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// Persist projects (and their blueprints) to localStorage, debounced so rapid
// edits don't thrash storage. Deep $subscribe catches nested blueprint edits.
const projects = useProjectStore(pinia)
let saveTimer: number | undefined
projects.$subscribe(() => {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => projects.persist(), 300)
})

app.mount('#app')
