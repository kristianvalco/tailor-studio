/** Reactive `matchMedia` — true while the given query matches. Used to switch
 *  the desktop three-pane layout to a single-pane, tabbed layout on phones. */
import { onScopeDispose, ref } from 'vue'

export function useMediaQuery(query: string) {
  const matches = ref(false)

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    const mql = window.matchMedia(query)
    matches.value = mql.matches
    const onChange = (e: MediaQueryListEvent) => (matches.value = e.matches)
    mql.addEventListener('change', onChange)
    onScopeDispose(() => mql.removeEventListener('change', onChange))
  }

  return matches
}

/** Below Tailwind's `lg` (1024px) we collapse to the single-pane mobile layout. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)')
}
