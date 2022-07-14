import { VERTICAL } from './defaults'


const itemSize = {
  type: [Number, Function],
  required: true,
}

const estimatedItemSize = {
  type: Number,
}

const cache = {
  type: Number,
  default: 2,
}

const direction = {
  type: String,
  values: ['ltr', 'rtl'],
  default: 'ltr',
}

const initScrollOffset = {
  type: Number,
  default: 0,
}

const total = {
  type: Number,
  required: true,
}

const layout = {
  type: String,
  values: ['horizontal', 'vertical'],
  default: VERTICAL,
}

export const virtualizedProps = {
  className: {
    type: String,
    default: '',
  },

  containerElement: {
    type: [String, Object],
    default: 'div',
  },

  data: {
    type: Array,
    default: () => [],
  },

  /**
   * @description controls the horizontal direction.
   */
  direction,

  height: {
    type: [String, Number],
    required: true,
  },

  innerElement: {
    type: [String, Object],
    default: 'div',
  },

  /* style: {
    type: [Object, String, Array],
  }, */

  useIsScrolling: {
    type: Boolean,
    default: false,
  },

  width: {
    type: [Number, String],
    required: false,
  },

  perfMode: {
    type: Boolean,
    default: true,
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
}

export const virtualizedListProps = {
  /**
   * @description describes how many items should be pre rendered to the head
   * and the tail of the window
   */
  cache,

  estimatedItemSize,

  /**
   * @description controls the list's orientation
   */
  layout,

  initScrollOffset,

  /**
   * @description describes the total number of the list.
   */
  total,

  itemSize,
  ...virtualizedProps,
}

const scrollbarSize = {
  type: Number,
  default: 6,
}

const startGap = { type: Number, default: 0 }
const endGap = { type: Number, default: 2 }


export const virtualizedScrollbarProps = {
  alwaysOn: Boolean,
  className: String,
  layout,
  total,
  ratio: {
    type: Number,
    required: true,
  },
  clientSize: {
    type: Number,
    required: true,
  },
  scrollFrom: {
    type: Number,
    required: true,
  },
  scrollbarSize,
  startGap,
  endGap,

  visible: Boolean,
}
