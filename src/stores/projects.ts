/**
 * Owns the list of projects. Each project is an independent set of blueprints
 * (multi-file ready). The editor always works against the *active* project;
 * `useBlueprintStore` proxies its `blueprints` to `activeProject.blueprints`.
 *
 * State is persisted to localStorage so work survives restarts.
 */
import { defineStore } from 'pinia'
import type { Project } from '@/types'
import { createMockBlueprints } from '@/data/mockBlueprints'
import { createId } from '@/utils/id'

const STORAGE_KEY = 'tailor-studio:projects:v1'

interface State {
  projects: Project[]
  activeProjectId: string | null
}

interface PersistShape {
  projects: Project[]
  activeProjectId: string | null
}

/** A fresh install: one demo project seeded with example blueprints. */
function defaultState(): State {
  const project: Project = {
    id: createId('proj'),
    name: 'Demo Project',
    blueprints: createMockBlueprints(),
  }
  return { projects: [project], activeProjectId: project.id }
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as PersistShape
    if (!parsed.projects?.length) return defaultState()
    return {
      projects: parsed.projects,
      activeProjectId: parsed.activeProjectId ?? parsed.projects[0].id,
    }
  } catch {
    return defaultState()
  }
}

export const useProjectStore = defineStore('projects', {
  state: (): State => loadState(),

  getters: {
    activeProject(state): Project | null {
      return state.projects.find((p) => p.id === state.activeProjectId) ?? null
    },
  },

  actions: {
    addProject(name = 'New Project'): Project {
      const project: Project = { id: createId('proj'), name, blueprints: [] }
      this.projects.push(project)
      this.activeProjectId = project.id
      return project
    },

    duplicateProject(id: string): Project | null {
      const source = this.projects.find((p) => p.id === id)
      if (!source) return null
      const clone: Project = structuredClone({ ...source, path: undefined })
      clone.id = createId('proj')
      clone.name = `${source.name} copy`
      this.projects.push(clone)
      this.activeProjectId = clone.id
      return clone
    },

    renameProject(id: string, name: string) {
      const project = this.projects.find((p) => p.id === id)
      if (project) project.name = name
    },

    deleteProject(id: string) {
      const idx = this.projects.findIndex((p) => p.id === id)
      if (idx === -1) return
      this.projects.splice(idx, 1)
      if (!this.projects.length) {
        const fresh = defaultState()
        this.projects = fresh.projects
        this.activeProjectId = fresh.activeProjectId
        return
      }
      if (this.activeProjectId === id) this.activeProjectId = this.projects[0].id
    },

    selectProject(id: string) {
      this.activeProjectId = id
    },

    persist() {
      try {
        const payload: PersistShape = {
          projects: this.projects,
          activeProjectId: this.activeProjectId,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch {
        /* storage unavailable — non-fatal */
      }
    },
  },
})
