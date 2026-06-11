/**
 * Field-level type definitions for the Tailor blueprint model.
 *
 * A `Field` is the editor's in-memory representation. It carries a stable
 * client-side `id` (never serialized to YAML) plus a `handle` (the YAML key)
 * and a bag of `config` values whose meaning depends on `type`.
 */

/** Every Tailor field type the MVP supports. Keep in sync with `fieldDefinitions`. */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'richeditor'
  | 'number'
  | 'datepicker'
  | 'switch'
  | 'checkbox'
  | 'dropdown'
  | 'colorpicker'
  | 'mediafinder'
  | 'fileupload'
  | 'codeeditor'
  | 'repeater'
  | 'entries'
  | 'section'
  | 'partial'

/** Tailor span values controlling backend form column width. */
export type FieldSpan = 'full' | 'left' | 'right' | 'auto'

/** A single option for dropdown / radio-style fields. */
export interface FieldOption {
  id: string
  value: string
  label: string
}

/**
 * Loosely-typed config bag. Each field type reads the keys it cares about
 * (see `fieldDefinitions`). Strongly-typed accessors live in composables.
 */
export interface FieldConfig {
  // Common
  required?: boolean
  comment?: string
  span?: FieldSpan
  tab?: string
  default?: unknown
  placeholder?: string

  // Choice fields
  options?: FieldOption[]

  // Number
  min?: number
  max?: number
  step?: number

  // Date mode ('date' | 'datetime' | 'time') or media/file mode ('image' | 'file').
  mode?: 'date' | 'datetime' | 'time' | 'image' | 'file'

  // Media / file
  maxItems?: number
  imageWidth?: number
  imageHeight?: number

  // Code editor
  language?: string

  // Section / partial
  path?: string

  // Entries relation
  source?: string
  relationType?: 'hasMany' | 'hasOne' | 'belongsTo' | 'belongsToMany'
  displayMode?: 'recordfinder' | 'taglist' | 'controller' | 'relation'

  // Escape hatch for advanced / future keys.
  [key: string]: unknown
}

/** The editable representation of one field. */
export interface Field {
  /** Stable client id — used for keys, drag-sort, selection. Not serialized. */
  id: string
  /** YAML key, e.g. `title`. */
  handle: string
  /** Human label shown in the OctoberCMS backend form. */
  label: string
  type: FieldType
  config: FieldConfig
  /** Nested fields for `repeater` (and future nestable types). */
  fields?: Field[]
}

/**
 * Static metadata describing a field type: how it appears in the picker and
 * which config controls to render. This is what makes the editor data-driven.
 */
export interface FieldDefinition {
  type: FieldType
  label: string
  /** Lucide-style icon name rendered by the `Icon` component. */
  icon: string
  /** Short description shown in the "Add field" menu. */
  description: string
  /** Grouping in the field picker. */
  category: 'basic' | 'rich' | 'choice' | 'media' | 'relational' | 'layout'
  /** Whether this field nests child fields (repeater). */
  nestable?: boolean
  /** Config controls to render in the field inspector. */
  options: FieldOptionControl[]
}

/** One configurable control in a field's inspector. */
export interface FieldOptionControl {
  key: string
  label: string
  control: 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'options' | 'blueprint'
  /** For `select` controls. */
  choices?: { value: string; label: string }[]
  placeholder?: string
  help?: string
  /** Default applied when a field of this type is created. */
  default?: unknown
}
