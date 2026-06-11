/** Lightweight pointer-drag resizer for a panel width (px), with clamping. */
import { ref } from 'vue'

export function useResizable(initial: number, min: number, max: number, opts: { invert?: boolean } = {}) {
  const size = ref(initial)
  let startX = 0
  let startSize = 0

  function onPointerMove(e: PointerEvent) {
    const delta = e.clientX - startX
    const next = startSize + (opts.invert ? -delta : delta)
    size.value = Math.min(max, Math.max(min, next))
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  function startResize(e: PointerEvent) {
    startX = e.clientX
    startSize = size.value
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return { size, startResize }
}
