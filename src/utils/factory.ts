/**
 * Factory helpers that produce well-formed editor entities with sensible
 * defaults pulled from the field registry.
 */
import type { Blueprint, BlueprintType, Field, FieldConfig, FieldType } from '@/types'
import { getFieldDefinition } from '@/data/fieldDefinitions'
import { createId } from './id'

/** Build a fresh field of the given type with registry defaults applied. */
export function createField(type: FieldType, overrides: Partial<Field> = {}): Field {
  const def = getFieldDefinition(type)
  const config: FieldConfig = {}
  for (const opt of def.options) {
    if (opt.default !== undefined) config[opt.key] = opt.default
  }

  const label = overrides.label ?? def.label
  const field: Field = {
    id: createId('fld'),
    handle: overrides.handle ?? '',
    label,
    type,
    config: { ...config, ...overrides.config },
  }

  if (def.nestable) field.fields = overrides.fields ?? []
  return field
}

/** Build a fresh, empty blueprint. */
export function createBlueprint(
  type: BlueprintType = 'structure',
  overrides: Partial<Blueprint> = {},
): Blueprint {
  return {
    id: createId('bp'),
    handle: overrides.handle ?? '',
    name: overrides.name ?? 'Untitled',
    type,
    navigation: overrides.navigation ?? { label: overrides.name ?? 'Untitled' },
    fields: overrides.fields ?? [],
    meta: overrides.meta,
  }
}
