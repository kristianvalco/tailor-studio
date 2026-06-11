/**
 * Helpers for turning labels into valid Tailor handles / field keys.
 */

/** A field handle: lower camelCase-ish snake, safe as a YAML key & DB column. */
export function slugifyFieldHandle(label: string): string {
  return label
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_')
    .toLowerCase() || 'field'
}

/** A blueprint handle uses StudlyCase segments, optionally namespaced (Blog\Post). */
export function slugifyBlueprintHandle(name: string): string {
  const studly = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return studly || 'Blueprint'
}

/** Ensure a handle is unique within a set of existing handles. */
export function uniqueHandle(base: string, existing: Iterable<string>): string {
  const taken = new Set(existing)
  if (!taken.has(base)) return base
  let i = 2
  while (taken.has(`${base}_${i}`)) i++
  return `${base}_${i}`
}
