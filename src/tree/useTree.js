import {
  CURRENT_CHANGE,
  NODE_CLICK,
  NODE_COLLAPSE,
  NODE_EXPAND,
  NODE_CHECK,
  NODE_CHECK_CHANGE,
  TreeOptionsEnum,
  SetOperationEnum,
} from './virtual-tree'
import { isFunction } from '@/utils'
import { JSet } from '@sangtian152/stl'
export const useTree = {
  data(){
    return {
      tree: {},
      currentKey: null,
      checkedKeys: new JSet(),
      indeterminateKeys: new JSet(),
      hiddenNodeKeySet: new JSet(),
      hiddenExpandIconKeySet:  new JSet(),
      expandedKeySet: new JSet(this.defaultExpandedKeys)
    }
  },
  computed: {
    valueKey() {
      return this.props.value || TreeOptionsEnum.KEY
    },
    childrenKey() {
      return this.props.children || TreeOptionsEnum.CHILDREN
    },
    disabledKey() {
      return this.props.disabled || TreeOptionsEnum.DISABLED
    },
    labelKey() {
      return this.props.label || TreeOptionsEnum.LABEL
    },
    filterable() {
      return isFunction(this.filterMethod)
    },
    flattenTree() {
      const expandedKeys = this.expandedKeySet
      const hiddenKeys = this.hiddenNodeKeySet
      const flattenNodes = []
      const nodes = (this.tree && this.tree.treeNodes) || []
      function traverse() {
        const stack = []
        for (let i = nodes.length - 1; i >= 0; --i) {
          stack.push(nodes[i])
        }
        while (stack.length) {
          const node = stack.pop()
          if (!node) continue
          if (!hiddenKeys.has(node.key)) {
            flattenNodes.push(node)
          }
          // Only "visible" nodes will be rendered
          if (expandedKeys.has(node.key)) {
            const children = node.children
            if (children) {
              const length = children.length
              for (let i = length - 1; i >= 0; --i) {
                stack.push(children[i])
              }
            }
          }
        }
      }
      traverse()
      return flattenNodes
    },
  
    isNotEmpty() {
      return this.flattenTree.length > 0
    }
  },
  watch: {
    currentNodeKey: {
      handler(key) {
        this.currentKey =key
      },
      immediate: true
    },
    data: {
      handler(data) {
        this.setData(data)
      },
      immediate: true
    },
    tree: {
      handler() {
        this.$nextTick(() => {
          this._setCheckedKeys(this.defaultCheckedKeys)
        })
      },
      immediate: true
    }
  },
  methods: {
    createTree(data) {
      const treeNodeMap = new Map()
      const levelTreeNodeMap = new Map()
      let maxLevel = 1
      const { getKey, getLabel, getChildren, getDisabled } = this;
      function traverse(
        nodes,
        level = 1,
        parent = undefined
      ) {
        const siblings = []
        for (const rawNode of nodes) {
          const value = getKey(rawNode)
          const node = {
            level,
            key: value,
            data: rawNode,
          }
          node.label = getLabel(rawNode)
          node.parent = parent
          const children = getChildren(rawNode)
          node.disabled = getDisabled(rawNode)
          node.isLeaf = !children || children.length === 0
          if (children && children.length) {
            node.children = traverse(children, level + 1, node)
          }
          siblings.push(node)
          treeNodeMap.set(value, node)
          if (!levelTreeNodeMap.has(level)) {
            levelTreeNodeMap.set(level, [])
          }
          levelTreeNodeMap.get(level).push(node)
        }
        if (level > maxLevel) {
          maxLevel = level
        }
        return siblings
      }
      const treeNodes = traverse(data)
      return {
        treeNodeMap,
        levelTreeNodeMap,
        maxLevel,
        treeNodes,
      }
    },
  
    filter(query) {
      const keys = this.doFilter(query)
      if (keys) {
        this.expandedKeySet = keys
      }
    },
    
    doFilter(query) {
      if (!this.filterable) {
        return
      }
      const expandKeySet = new JSet()
      const hiddenExpandIconKeys = this.hiddenExpandIconKeySet
      const hiddenKeys = this.hiddenNodeKeySet
      const family = []
      const nodes = this.tree.treeNodes || []
      const filter = this.filterMethod
      hiddenKeys.clear()
      function traverse(nodes) {
        nodes.forEach((node) => {
          family.push(node)
          if (filter(query, node.data)) {
            family.forEach((member) => {
              expandKeySet.add(member.key)
            })
          } else if (node.isLeaf) {
            hiddenKeys.add(node.key)
          }
          const children = node.children
          if (children) {
            traverse(children)
          }
          if (!node.isLeaf) {
            if (!expandKeySet.has(node.key)) {
              hiddenKeys.add(node.key)
            } else if (children) {
              // If all child nodes are hidden, then the expand icon will be hidden
              let allHidden = true
              for (const childNode of children) {
                if (!hiddenKeys.has(childNode.key)) {
                  allHidden = false
                  break
                }
              }
              if (allHidden) {
                hiddenExpandIconKeys.add(node.key)
              } else {
                hiddenExpandIconKeys.delete(node.key)
              }
            }
          }
          family.pop()
        })
      }
      traverse(nodes)
      return expandKeySet
    },
  
    isForceHiddenExpandIcon(node) {
      return this.hiddenExpandIconKeySet.has(node.key)
    },

    getChildren(node) {
      return node[this.childrenKey]
    },
  
    getKey(node) {
      if (!node) {
        return ''
      }
      return node[this.valueKey]
    },
  
    getDisabled(node) {
      return node[this.disabledKey]
    },
  
    getLabel(node) {
      return node[this.labelKey]
    },
  
    toggleExpand(node) {
      const expandedKeys = this.expandedKeySet
      if (expandedKeys.has(node.key)) {
        this.collapse(node)
      } else {
        this.expand(node)
      }
    },
  
    handleNodeClick(node, e) {
      this.$emit(NODE_CLICK, node.data, node, e)
      this.handleCurrentChange(node)
      if (this.expandOnClickNode) {
        this.toggleExpand(node)
      }
      if (this.showCheckbox && this.checkOnClickNode && !node.disabled) {
        this.toggleCheckbox(node, !this.isChecked(node), true)
      }
    },
  
    handleCurrentChange(node) {
      if (!this.isCurrent(node)) {
        this.currentKey = node.key
        this.$emit(CURRENT_CHANGE, node.data, node)
      }
    },
  
    handleNodeCheck(node, checked) {
      this.toggleCheckbox(node, checked)
    },
  
    expand(node) {
      const keySet = this.expandedKeySet
      if (this.tree && this.accordion) {
        // whether only one node among the same level can be expanded at one time
        const { treeNodeMap } = this.tree
        keySet.forEach((key) => {
          const node = treeNodeMap.get(key)
          if (node && node.level === node.level) {
            keySet.delete(key)
          }
        })
      }
      keySet.add(node.key)
      this.$emit(NODE_EXPAND, node.data, node)
    },
  
    collapse(node) {
      this.expandedKeySet.delete(node.key)
      this.$emit(NODE_COLLAPSE, node.data, node)
    },
  
    isExpanded(node) {
      return this.expandedKeySet.has(node.key)
    },
  
    isDisabled(node) {
      return !!node.disabled
    },
  
    isCurrent(node) {
      const current = this.currentKey
      return !!current && current === node.key
    },
  
    getCurrentNode() {
      if (!this.currentKey) return undefined
      return this.tree.treeNodeMap.get(this.currentKey).data
    },
  
    getCurrentKey() {
      return this.currentKey
    },
  
    setCurrentKey(key) {
      this.currentKey = key
    },
  
    setData(data) {
      this.$nextTick(() => {
        this.tree = this.createTree(data)
      })
    },
    /* ----------- check相关方法 ----------- */
    updateCheckedKeys() {
      if (!this.tree || !this.showCheckbox || this.checkStrictly) {
        return
      }
      const { levelTreeNodeMap, maxLevel } = this.tree
      const checkedKeySet = this.checkedKeys
      const indeterminateKeySet = new Set()
      // It is easier to determine the indeterminate state by
      // traversing from bottom to top
      // leaf nodes not have indeterminate status and can be skipped
      for (let level = maxLevel - 1; level >= 1; --level) {
        const nodes = levelTreeNodeMap.get(level)
        if (!nodes) continue
        nodes.forEach((node) => {
          const children = node.children
          if (children) {
            // Whether all child nodes are selected
            let allChecked = true
            // Whether a child node is selected
            let hasChecked = false
            for (const childNode of children) {
              const key = childNode.key
              if (checkedKeySet.has(key)) {
                hasChecked = true
              } else if (indeterminateKeySet.has(key)) {
                allChecked = false
                hasChecked = true
                break
              } else {
                allChecked = false
              }
            }
            if (allChecked) {
              checkedKeySet.add(node.key)
            } else if (hasChecked) {
              indeterminateKeySet.add(node.key)
              checkedKeySet.delete(node.key)
            } else {
              checkedKeySet.delete(node.key)
              indeterminateKeySet.delete(node.key)
            }
          }
        })
      }
      this.indeterminateKeys = indeterminateKeySet
    },
  
    isChecked (node){
      this.checkedKeys.has(node.key)
    },
  
    isIndeterminate(node) {
      this.indeterminateKeys.has(node.key)
    },
  
    toggleCheckbox (
      node,
      isChecked,
      nodeClick = true
    ) {
      const checkedKeySet = this.checkedKeys
      const toggle = (node, checked) => {
        checkedKeySet[checked ? SetOperationEnum.ADD : SetOperationEnum.DELETE](
          node.key
        )
        const children = node.children
        if (!this.checkStrictly && children) {
          children.forEach((childNode) => {
            if (!childNode.disabled) {
              toggle(childNode, checked)
            }
          })
        }
      }
      toggle(node, isChecked)
      this.updateCheckedKeys()
      if (nodeClick) {
        this.afterNodeCheck(node, isChecked)
      }
    },
  
    afterNodeCheck (node, checked) {
      const { checkedNodes, checkedKeys } = this.getChecked()
      const { halfCheckedNodes, halfCheckedKeys } = this.getHalfChecked()
      this.$emit(NODE_CHECK, node.data, {
        checkedKeys,
        checkedNodes,
        halfCheckedKeys,
        halfCheckedNodes,
      })
      this.$emit(NODE_CHECK_CHANGE, node.data, checked)
    },
  
    // expose
    getCheckedKeys(leafOnly = false) {
      return this.getChecked(leafOnly).checkedKeys
    },
  
    getCheckedNodes(leafOnly = false) {
      return this.getChecked(leafOnly).checkedNodes
    },
  
    getHalfCheckedKeys() {
      return this.getHalfChecked().halfCheckedKeys
    },
  
    getHalfCheckedNodes() {
      return this.getHalfChecked().halfCheckedNodes
    },
  
    getChecked(leafOnly = false) {
      const checkedNodes = []
      const keys = []
      if (this.tree && this.showCheckbox) {
        const { treeNodeMap } = this.tree
        this.checkedKeys.forEach((key) => {
          const node = treeNodeMap.get(key)
          if (node && (!leafOnly || (leafOnly && node.isLeaf))) {
            keys.push(key)
            checkedNodes.push(node.data)
          }
        })
      }
      return {
        checkedKeys: keys,
        checkedNodes,
      }
    },
  
    getHalfChecked() {
      const halfCheckedNodes = []
      const halfCheckedKeys = []
      if (this.tree && this.showCheckbox) {
        const { treeNodeMap } = this.tree
        this.indeterminateKeys.forEach((key) => {
          const node = treeNodeMap.get(key)
          if (node) {
            halfCheckedKeys.push(key)
            halfCheckedNodes.push(node.data)
          }
        })
      }
      return {
        halfCheckedNodes,
        halfCheckedKeys,
      }
    },
  
    setCheckedKeys(keys) {
      this.checkedKeys.clear()
      this.indeterminateKeys.clear()
      this._setCheckedKeys(keys)
    },
  
    setChecked(key, isChecked) {
      if (this.tree && this.showCheckbox) {
        const node = this.tree.treeNodeMap.get(key)
        if (node) {
          this.toggleCheckbox(node, isChecked, false)
        }
      }
    },
  
    _setCheckedKeys(keys) {
      if (this.tree) {
        const { treeNodeMap } = this.tree
        if (this.showCheckbox && treeNodeMap && keys) {
          for (const key of keys) {
            const node = treeNodeMap.get(key)
            if (node && !this.isChecked(node)) {
              this.toggleCheckbox(node, true, false)
            }
          }
        }
      }
    }
  },
}
