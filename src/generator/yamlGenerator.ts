/**
 * Turns the editor's `Blueprint` model into OctoberCMS Tailor blueprint YAML.
 *
 * We build an ordered plain-object tree first (js-yaml preserves insertion
 * order) so output keys follow OctoberCMS conventions, then dump once.
 */
import yaml from 'js-yaml'
import type { Blueprint, Field, FieldOption } from '@/types'

/** Config keys that are UI-only and must never be written to YAML. */
const SKIP_KEYS = new Set(['options', 'source', 'relationType', 'displayMode'])

/** Build the ordered YAML object for a single field. */
function fieldToObject(field: Field): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  if (field.label) out.label = field.label
  out.type = field.type

  const c = field.config ?? {}

  // Emit common/scalar config in a stable, readable order.
  const ordered = [
    'span',
    'tab',
    'required',
    'placeholder',
    'comment',
    'default',
    'mode',
    'size',
    'min',
    'max',
    'step',
    'language',
    'maxItems',
    'prompt',
    'path',
    'toolbarButtons',
  ]

  for (const key of ordered) {
    const value = c[key]
    if (value === undefined || value === null || value === '') continue
    // Don't emit `span: full` — it's the default and adds noise.
    if (key === 'span' && value === 'full') continue
    if (key === 'required' && value === false) continue
    out[key] = value
  }

  // Dropdown-style options become a value→label map.
  if (field.type === 'dropdown' && Array.isArray(c.options) && c.options.length) {
    out.options = (c.options as FieldOption[]).reduce<Record<string, string>>((acc, o) => {
      if (o.value) acc[o.value] = o.label || o.value
      return acc
    }, {})
  }

  // Entries relation keys.
  if (field.type === 'entries') {
    if (c.source) out.source = c.source
    if (c.displayMode) out.displayMode = c.displayMode
    if (c.relationType) out.relationType = c.relationType
  }

  // Repeater nests its child fields under `form.fields`.
  if (field.type === 'repeater' && field.fields) {
    out.form = { fields: fieldsToObject(field.fields) }
  }

  return out
}

/** Build the `fields:` map from a list of fields. */
function fieldsToObject(fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  fields.forEach((field, i) => {
    const handle = field.handle || `field_${i + 1}`
    out[handle] = fieldToObject(field)
  })
  return out
}

/** Build the full ordered blueprint object. */
export function blueprintToObject(bp: Blueprint): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  if (bp.uuid) out.uuid = bp.uuid
  out.handle = bp.handle || 'Untitled'
  out.type = bp.type
  out.name = bp.name || 'Untitled'

  const nav = bp.navigation
  if (nav && (nav.label || nav.icon || nav.order != null)) {
    const navOut: Record<string, unknown> = {}
    if (nav.label) navOut.label = nav.label
    if (nav.icon) navOut.icon = nav.icon
    if (nav.order != null) navOut.order = nav.order
    out.navigation = navOut
  }

  if (bp.meta) Object.assign(out, bp.meta)

  out.fields = fieldsToObject(bp.fields)
  return out
}

/** Generate the YAML string for a blueprint. */
export function generateYaml(bp: Blueprint): string {
  const obj = blueprintToObject(bp)
  return yaml.dump(obj, {
    indent: 4,
    lineWidth: 100,
    noRefs: true,
    quotingType: '"',
    sortKeys: false,
  })
}

/** Mark this module's reserved keys as exported for the parser to mirror. */
export const RESERVED_FIELD_KEYS = SKIP_KEYS
