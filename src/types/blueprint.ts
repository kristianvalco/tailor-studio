/**
 * Blueprint-level type definitions.
 *
 * A `Blueprint` maps onto a single OctoberCMS Tailor blueprint YAML file.
 */
import type { Field } from './field'

/** Tailor blueprint kinds. */
export type BlueprintType = 'single' | 'structure' | 'stream' | 'global'

/** The editable representation of a Tailor blueprint. */
export interface Blueprint {
  /** Stable client id. Not serialized to YAML. */
  id: string
  /** Tailor `handle`, e.g. `Blog\Post`. Acts as the unique key. */
  handle: string
  name: string
  type: BlueprintType
  /** Optional UUID Tailor uses to track blueprints across renames. */
  uuid?: string

  // Navigation (backend menu) settings.
  navigation?: {
    label?: string
    icon?: string
    /** Sort order within the parent group. */
    order?: number
  }

  fields: Field[]

  /** Free-form drawer for blueprint-level keys not yet modelled in the UI. */
  meta?: Record<string, unknown>
}

/** A collection of blueprints forming a project (multi-file ready). */
export interface Project {
  id: string
  name: string
  blueprints: Blueprint[]
  /** Absolute path on disk once saved, if any. */
  path?: string
}
