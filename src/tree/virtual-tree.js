// constants
export const ROOT_TREE_INJECTION_KEY = 'r-tree'
const EMPTY_NODE = {
  key: -1,
  level: -1,
  data: {},
}

// enums
export const TreeOptionsEnum = {
  KEY: 'id',
  LABEL: 'label',
  CHILDREN: 'children',
  DISABLED: 'disabled',
}

export const SetOperationEnum = {
  ADD: 'add',
  DELETE: 'delete',
}

// props
export const treeProps = {
  data: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
  },
  height: {
    type: Number,
    default: 200,
  },
  itemSize: {
    type: Number,
    default: 26
  },
  props: {
    type: Object,
    default: () => {
      return {
        children: TreeOptionsEnum.CHILDREN,
        label: TreeOptionsEnum.LABEL,
        disabled: TreeOptionsEnum.DISABLED,
        value: TreeOptionsEnum.KEY,
      }
    }
  },
  highlightCurrent: {
    type: Boolean,
    default: false,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  defaultCheckedKeys: {
    type: Array,
    default: () => [],
  },
  // Whether checked state of a node not affects its father and
  // child nodes when show-checkbox is true
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  defaultExpandedKeys: {
    type: Array,
    default: () => [],
  },
  indent: {
    type: Number,
    default: 16,
  },
  icon: {
    type: [
      String,
      Object,
      Function,
    ],
  },
  expandOnClickNode: {
    type: Boolean,
    default: true,
  },
  checkOnClickNode: {
    type: Boolean,
    default: false,
  },
  currentNodeKey: {
    type: [String, Number],
  },
  // TODO need to optimization
  accordion: {
    type: Boolean,
    default: false,
  },
  filterMethod: {
    type: Function,
  },
  // Performance mode will increase memory usage, but scrolling will be smoother
  perfMode: {
    type: Boolean,
    default: true,
  },
}

export const treeNodeProps = {
  node: {
    type: Object,
    default: () => EMPTY_NODE,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  current: {
    type: Boolean,
    default: false,
  },
  hiddenExpandIcon: {
    type: Boolean,
    default: false,
  },
}

// emits
export const NODE_CLICK = 'node-click'
export const NODE_EXPAND = 'node-expand'
export const NODE_COLLAPSE = 'node-collapse'
export const CURRENT_CHANGE = 'current-change'
export const NODE_CHECK = 'check'
export const NODE_CHECK_CHANGE = 'check-change'
export const NODE_CONTEXTMENU = 'node-contextmenu'
