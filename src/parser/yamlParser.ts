/**
 * Parses OctoberCMS Tailor blueprint YAML back into the editor's model,
 * reconstructing fields, nested repeaters and dropdown options.
 */
import yaml from 'js-yaml'
import type {
  Blueprint,
  BlueprintType,
  Field,
  FieldConfig,
  FieldOption,
  FieldType,
} from '@/types'
import { fieldDefinitionMap } from '@/data/fieldDefinitions'
import { createId } from '@/utils/id'

export interface ParseResult {
  blueprint: Blueprint | null
  error: string | null
}

const KNOWN_TYPES = new Set(Object.keys(fieldDefinitionMap)) as Set<string>

/** Keys we lift into the field's own properties / handle separately. */
const STRUCTURAL_KEYS = new Set(['label', 'type', 'form', 'options'])

function parseField(handle: string, raw: Record<string, unknown>): Field {
  const rawType = String(raw.type ?? 'text')
  const type: FieldType = (KNOWN_TYPES.has(rawType) ? rawType : 'text') as FieldType

  const config: FieldConfig = {}
  for (const [key, value] of Object.entries(raw)) {
    if (STRUCTURAL_KEYS.has(key)) continue
    config[key] = value
  }

  // Dropdown option map → ordered array the inspector can edit.
  if (type === 'dropdown' && raw.options && typeof raw.options === 'object') {
    const options: FieldOption[] = Object.entries(raw.options as Record<string, unknown>).map(
      ([value, label]) => ({ id: createId('opt'), value, label: String(label) }),
    )
    config.options = options
  }

  const field: Field = {
    id: createId('fld'),
    handle,
    label: typeof raw.label === 'string' ? raw.label : handle,
    type,
    config,
  }

  // Repeater children live under `form.fields`.
  if (type === 'repeater') {
    const form = raw.form as { fields?: Record<string, unknown> } | undefined
    field.fields = form?.fields ? parseFields(form.fields) : []
  }

  return field
}

function parseFields(raw: Record<string, unknown>): Field[] {
  return Object.entries(raw).map(([handle, value]) =>
    parseField(handle, (value ?? {}) as Record<string, unknown>),
  )
}

/** Parse a YAML string into a Blueprint. Never throws — returns an error string. */
export function parseYaml(source: string): ParseResult {
  let doc: unknown
  try {
    doc = yaml.load(source)
  } catch (e) {
    return { blueprint: null, error: e instanceof Error ? e.message : 'Invalid YAML' }
  }

  if (!doc || typeof doc !== 'object') {
    return { blueprint: null, error: 'Document is empty or not a blueprint.' }
  }

  const d = doc as Record<string, unknown>
  const rawType = String(d.type ?? 'structure')
  const type: BlueprintType = (['single', 'structure', 'stream', 'global'].includes(rawType)
    ? rawType
    : 'structure') as BlueprintType

  const nav = (d.navigation ?? {}) as Record<string, unknown>

  // Preserve unmodelled top-level keys in `meta` so re-export is lossless.
  const meta: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(d)) {
    if (['uuid', 'handle', 'type', 'name', 'navigation', 'fields'].includes(key)) continue
    meta[key] = value
  }

  const blueprint: Blueprint = {
    id: createId('bp'),
    uuid: typeof d.uuid === 'string' ? d.uuid : undefined,
    handle: typeof d.handle === 'string' ? d.handle : 'Untitled',
    name: typeof d.name === 'string' ? d.name : 'Untitled',
    type,
    navigation: {
      label: typeof nav.label === 'string' ? nav.label : undefined,
      icon: typeof nav.icon === 'string' ? nav.icon : undefined,
      order: typeof nav.order === 'number' ? nav.order : undefined,
    },
    fields: d.fields && typeof d.fields === 'object' ? parseFields(d.fields as Record<string, unknown>) : [],
    meta: Object.keys(meta).length ? meta : undefined,
  }

  return { blueprint, error: null }
}
