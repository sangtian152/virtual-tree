<template>
  <div
    ref="node$"
    :class="[
      bem('node'),
      {
        expanded: expanded,
        current: current,
        focusable: !disabled,
        checked: !disabled && checked,
      },
    ]"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="disabled"
    :aria-checked="checked"
    :data-key="node.key"
    @click.stop="handleClick"
    @contextmenu="handleContextMenu"
  >
    <div
      :class="bem('content')"
      :style="{ paddingLeft: `${(node.level - 1) * indent}px` }"
    >
      <span
        :class="[
          bem('expand-icon'),
          {
            'is-leaf': node.isLeaf,
            'is-hidden': hiddenExpandIcon,
            expanded: !node.isLeaf && expanded,
          },
        ]"
        @click.stop="handleExpandIconClick"
      >
        <vl-icon
          :node="node"
          name="caret-right"
        />
      </span>
      <vl-checkbox
        v-if="showCheckbox"
        :value="checked"
        :indeterminate="indeterminate"
        :disabled="disabled"
        @change="handleCheckChange"
        @click.native.stop
      />
      <vl-node-content :node="node" />
    </div>
  </div>
</template>

<script>
import VlIcon from "@/components/icon";
import VlCheckbox from "@/components/checkbox";
import { createNamespace } from "@/utils/created";
import VlNodeContent from "./tree-node-content";
import {
  NODE_CONTEXTMENU,
  ROOT_TREE_INJECTION_KEY,
  treeNodeProps,
} from "./virtual-tree";

export default {
  name: "VlTreeNode",
  components: {
    VlIcon,
    VlCheckbox,
    VlNodeContent,
  },
  props: treeNodeProps,
  inject: [ROOT_TREE_INJECTION_KEY],
  provide() {
    return {
      treeSlot: this.tree.$scopedSlots,
    };
  },
  data() {
    return {
      bem: createNamespace("tree")[1],
    };
  },
  computed: {
    tree() {
      return this[ROOT_TREE_INJECTION_KEY] || {};
    },
    indent() {
      return this.tree.indent || 16;
    },
  },
  methods: {
    handleClick(e) {
      this.$emit("click", this.node, e);
    },
    handleExpandIconClick() {
      this.$emit("toggle", this.node);
    },
    handleCheckChange(value) {
      this.$emit("check", this.node, value);
    },
    handleContextMenu(event) {
      if (this.tree.$listeners[NODE_CONTEXTMENU]) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.tree.$emit(NODE_CONTEXTMENU, event, this.node.data, this.node);
    },
  },
};
</script>
