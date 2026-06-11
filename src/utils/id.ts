import { nanoid } from 'nanoid'

/** Short, collision-resistant client id for editor entities. */
export function createId(prefix = 'id'): string {
  return `${prefix}_${nanoid(8)}`
}
