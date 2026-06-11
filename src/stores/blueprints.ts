/**
 * Central store for the project's blueprints and editor selection.
 *
 * Mutations here are deliberately small and explicit so future undo/redo and
 * persistence layers can wrap them.
 */
import { defineStore } from 'pinia'
import type { Blueprint, BlueprintType, Field, FieldType } from '@/types'
import { createBlueprint, createField } from '@/utils/factory'
import { slugifyFieldHandle, uniqueHandle } from '@/utils/handle'
import { generateYaml } from '@/generator/yamlGenerator'
import { parseYaml } from '@/parser/yamlParser'
import { createId } from '@/utils/id'
import { useProjectStore } from '@/stores/projects'
import type { BlueprintTemplate } from '@/data/templates'

interface State {
  selectedBlueprintId: string | null
  /** Stack of field ids identifying the open repeater nesting path. */
  fieldPath: string[]
  selectedFieldId: string | null
}

export const useBlueprintStore = defineStore('blueprints', {
  state: (): State => ({
    selectedBlueprintId: null,
    fieldPath: [],
    selectedFieldId: null,
  }),

  getters: {
    /** Blueprints of the active project (reactive — safe to push/splice). */
    blueprints(): Blueprint[] {
      return useProjectStore().activeProject?.blueprints ?? []
    },

    selectedBlueprint(): Blueprint | null {
      return this.blueprints.find((b) => b.id === this.selectedBlueprintId) ?? null
    },

    /**
     * The field list currently being edited — top-level, or the children of the
     * repeater chain described by `fieldPath`.
     */
    activeFields(): Field[] {
      const bp = this.selectedBlueprint
      if (!bp) return []
      let fields = bp.fields
      for (const id of this.fieldPath) {
        const parent = fields.find((f) => f.id === id)
        if (!parent?.fields) return []
        fields = parent.fields
      }
      return fields
    },

    /** Breadcrumb of repeater fields the user has descended into. */
    breadcrumb(): Field[] {
      const bp = this.selectedBlueprint
      if (!bp) return []
      const crumbs: Field[] = []
      let fields = bp.fields
      for (const id of this.fieldPath) {
        const parent = fields.find((f) => f.id === id)
        if (!parent) break
        crumbs.push(parent)
        fields = parent.fields ?? []
      }
      return crumbs
    },

    selectedField(): Field | null {
      return this.activeFields.find((f) => f.id === this.selectedFieldId) ?? null
    },

    yaml(): string {
      return this.selectedBlueprint ? generateYaml(this.selectedBlueprint) : ''
    },
  },

  actions: {
    selectBlueprint(id: string) {
      this.selectedBlueprintId = id
      this.fieldPath = []
      this.selectedFieldId = null
    },

    /** Reset editor selection to the first blueprint of the active project. */
    syncSelection() {
      this.selectedBlueprintId = this.blueprints[0]?.id ?? null
      this.fieldPath = []
      this.selectedFieldId = null
    },

    // ---- Project switching ---------------------------------------------------

    switchProject(id: string) {
      useProjectStore().selectProject(id)
      this.syncSelection()
    },

    newProject(name = 'New Project') {
      useProjectStore().addProject(name)
      this.syncSelection()
    },

    addBlueprint(type: BlueprintType = 'structure') {
      const handles = this.blueprints.map((b) => b.handle)
      const bp = createBlueprint(type, {
        name: 'Untitled',
        handle: uniqueHandle('Untitled', handles),
      })
      this.blueprints.push(bp)
      this.selectBlueprint(bp.id)
    },

    /** Create a blueprint pre-filled from a ready-made template. */
    addBlueprintFromTemplate(template: BlueprintTemplate) {
      const data = template.build()
      const handles = this.blueprints.map((b) => b.handle)
      const bp = createBlueprint(data.type, {
        name: data.name,
        handle: uniqueHandle(data.handle, handles),
        navigation: data.navigation,
        fields: data.fields,
      })
      this.blueprints.push(bp)
      this.selectBlueprint(bp.id)
    },

    deleteBlueprint(id: string) {
      const idx = this.blueprints.findIndex((b) => b.id === id)
      if (idx === -1) return
      this.blueprints.splice(idx, 1)
      if (this.selectedBlueprintId === id) {
        this.selectedBlueprintId = this.blueprints[0]?.id ?? null
        this.fieldPath = []
        this.selectedFieldId = null
      }
    },

    // ---- Repeater navigation -------------------------------------------------

    enterRepeater(fieldId: string) {
      this.fieldPath.push(fieldId)
      this.selectedFieldId = null
    },

    /** Jump back to a given depth in the repeater path (0 = top level). */
    gotoDepth(depth: number) {
      this.fieldPath = this.fieldPath.slice(0, depth)
      this.selectedFieldId = null
    },

    // ---- Field mutations -----------------------------------------------------

    addField(type: FieldType) {
      const fields = this.activeFields
      const handle = uniqueHandle(
        slugifyFieldHandle(type),
        fields.map((f) => f.handle),
      )
      const field = createField(type, { handle })
      fields.push(field)
      this.selectedFieldId = field.id
    },

    removeField(id: string) {
      const fields = this.activeFields
      const idx = fields.findIndex((f) => f.id === id)
      if (idx !== -1) fields.splice(idx, 1)
      if (this.selectedFieldId === id) this.selectedFieldId = null
    },

    duplicateField(id: string) {
      const fields = this.activeFields
      const idx = fields.findIndex((f) => f.id === id)
      if (idx === -1) return
      const original = fields[idx]
      const clone = structuredClone({ ...original })
      reassignIds(clone)
      clone.handle = uniqueHandle(original.handle || 'field', fields.map((f) => f.handle))
      fields.splice(idx + 1, 0, clone)
      this.selectedFieldId = clone.id
    },

    selectField(id: string | null) {
      this.selectedFieldId = id
    },

    /** Replace the active field list wholesale (used by drag-sort). */
    setActiveFields(fields: Field[]) {
      const bp = this.selectedBlueprint
      if (!bp) return
      if (this.fieldPath.length === 0) {
        bp.fields = fields
        return
      }
      let parentFields = bp.fields
      for (let i = 0; i < this.fieldPath.length - 1; i++) {
        const parent = parentFields.find((f) => f.id === this.fieldPath[i])
        if (!parent?.fields) return
        parentFields = parent.fields
      }
      const lastId = this.fieldPath[this.fieldPath.length - 1]
      const parent = parentFields.find((f) => f.id === lastId)
      if (parent) parent.fields = fields
    },

    // ---- Import --------------------------------------------------------------

    importYaml(source: string): string | null {
      const { blueprint, error } = parseYaml(source)
      if (error || !blueprint) return error ?? 'Could not parse blueprint.'
      // Replace if a blueprint with the same handle exists, else append.
      const idx = this.blueprints.findIndex((b) => b.handle === blueprint.handle)
      if (idx !== -1) {
        blueprint.id = this.blueprints[idx].id
        this.blueprints.splice(idx, 1, blueprint)
      } else {
        this.blueprints.push(blueprint)
      }
      this.selectBlueprint(blueprint.id)
      return null
    },
  },
})

/** Recursively assign fresh ids to a cloned field tree. */
function reassignIds(field: Field) {
  field.id = createId('fld')
  field.fields?.forEach(reassignIds)
}
