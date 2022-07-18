// @ts-nocheck
import { cAF, isFirefox, rAF } from '@/utils'
import { HORIZONTAL, VERTICAL } from '../defaults'


const LayoutKeys = {
  [HORIZONTAL]: 'deltaX',
  [VERTICAL]: 'deltaY',
}

const useWheel = (
  { atEndEdge, atStartEdge, layout },
  onWheelDelta
) => {
  let frameHandle
  let offset = 0

  const hasReachedEdge = (offset) => {
    const edgeReached =
      (offset < 0 && atStartEdge.value) || (offset > 0 && atEndEdge.value)

    return edgeReached
  }

  const onWheel = (e) => {
    cAF(frameHandle)

    const newOffset = e[LayoutKeys[layout.value]]

    if (hasReachedEdge(offset) && hasReachedEdge(offset + newOffset)) return

    offset += newOffset

    if (!isFirefox()) {
      e.preventDefault()
    }

    frameHandle = rAF(() => {
      onWheelDelta(offset)
      offset = 0
    })
  }

  return {
    hasReachedEdge,
    onWheel,
  }
}

export default useWheel
