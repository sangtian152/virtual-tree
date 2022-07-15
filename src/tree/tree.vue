<template>
  <div
    :class="[bem(), { ['highlight-current']: highlightCurrent }]"
    role="tree"
  >
    <fixed-size-list
      v-if="isNotEmpty"
      :class-name="'virtual-list'"
      :data="flattenTree"
      :total="flattenTree.length"
      :height="height"
      :item-size="itemSize"
      :perf-mode="perfMode"
    >
      <template v-slot="{ node, style }">
        <v2-tree-node
          :key="node.key"
          :style="style"
          :node="node"
          :expanded="expandedKeySet.has(node.key)"
          :show-checkbox="showCheckbox"
          :checked="checkedKeys.has(node.key)"
          :indeterminate="indeterminateKeys.has(node.key)"
          :disabled="!!node.disabled"
          :current="!!currentKey && currentKey===node.key"
          @click="handleNodeClick"
          @toggle="toggleExpand"
          @check="handleNodeCheck"
        />
      </template>
    </fixed-size-list>
    <div v-else :class="'empty-block'">
      <span :class="'empty-text'">{{
        emptyText
      }}</span>
    </div>
  </div>
</template>

<script>
import V2TreeNode from './tree-node.vue'
import { useTree } from './useTree'
import { FixedSizeList } from '@/components/virtual-list'
import { ROOT_TREE_INJECTION_KEY, treeProps } from './virtual-tree'
import { createNamespace } from '@/utils/created'

export default {
  name: 'V2Tree',
  components: {
    V2TreeNode,
    FixedSizeList,
  },
  mixins: [useTree],
  props: treeProps,
  provide() {
    return {
      [ROOT_TREE_INJECTION_KEY]: this,
    }
  },
  data() {
    return {
      itemSize: 26,
      bem: createNamespace('tree')[1]
    }
  },
  methods: {},
}
</script>
