/**
 * Translation helpers for registry-derived strings (field types, option labels,
 * choice labels). Falls back to the English registry value when no translation
 * key exists, so English needs no duplicated messages.
 */
import { useI18n } from 'vue-i18n'
import type { FieldDefinition, FieldOptionControl } from '@/types'

export function useFieldI18n() {
  const { t, te } = useI18n()

  function typeLabel(def: FieldDefinition): string {
    const key = `fieldType.${def.type}.label`
    return te(key) ? t(key) : def.label
  }

  function typeDescription(def: FieldDefinition): string {
    const key = `fieldType.${def.type}.description`
    return te(key) ? t(key) : def.description
  }

  function optionLabel(ctrl: FieldOptionControl): string {
    const key = `fieldOption.${ctrl.key}`
    return te(key) ? t(key) : ctrl.label
  }

  function optionHelp(ctrl: FieldOptionControl): string | undefined {
    return ctrl.help
  }

  function choiceLabel(value: string, fallback: string): string {
    const key = `choice.${value}`
    return te(key) ? t(key) : fallback
  }

  function categoryLabel(category: string, fallback: string): string {
    const key = `categories.${category}`
    return te(key) ? t(key) : fallback
  }

  return { typeLabel, typeDescription, optionLabel, optionHelp, choiceLabel, categoryLabel }
}
