// @ts-nocheck
import {
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  LTR,
  PageKey,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
  RTL_OFFSET_POS_DESC,
} from './defaults'


export const getScrollDir = (prev, cur) =>
  prev < cur ? FORWARD : BACKWARD

export const isHorizontal = (dir) =>
  dir === LTR || dir === RTL || dir === HORIZONTAL

export const isRTL = (dir) => dir === RTL

let cachedRTLResult = null

export function getRTLOffsetType(recalculate = false) {
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement('div')
    const outerStyle = outerDiv.style
    outerStyle.width = '50px'
    outerStyle.height = '50px'
    outerStyle.overflow = 'scroll'
    outerStyle.direction = 'rtl'

    const innerDiv = document.createElement('div')
    const innerStyle = innerDiv.style
    innerStyle.width = '100px'
    innerStyle.height = '100px'

    outerDiv.appendChild(innerDiv)

    document.body.appendChild(outerDiv)

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = RTL_OFFSET_POS_DESC
    } else {
      outerDiv.scrollLeft = 1
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = RTL_OFFSET_NAG
      } else {
        cachedRTLResult = RTL_OFFSET_POS_ASC
      }
    }

    document.body.removeChild(outerDiv)

    return cachedRTLResult
  }

  return cachedRTLResult
}

export const getRelativePos = (
  e,
  layout
) => {
  return 'touches' in e ? e.touches[0][PageKey[layout]] : e[PageKey[layout]]
}


export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
};

export function renderThumbStyle(
  { move, size, bar },
  layout
) {
  const style = {}
  const translate = `translate${bar.axis}(${move}px)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  // polyfill
  ;(style).webkitTransform = translate

  if (layout === 'horizontal') {
    style.height = '100%'
  } else {
    style.width = '100%'
  }

  return style
}
