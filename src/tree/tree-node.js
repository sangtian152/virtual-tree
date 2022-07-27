import VlIcon from "@/components/icon";
import VlCheckbox from "@/components/checkbox";
import { createNamespace } from "@/utils/created";
const _createNamespace = createNamespace("tree-node"),
  createComponent = _createNamespace[0],
  bem = _createNamespace[1];

import VlNodeContent from "./tree-node-content";
import {
  NODE_CONTEXTMENU,
  ROOT_TREE_INJECTION_KEY,
  treeNodeProps,
} from "./virtual-tree";

export default createComponent({
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
    genCheckbox() {
      return (
        <vl-checkbox
          value={this.checked}
          class="vl-tree__checkbox"
          indeterminate={this.indeterminate}
          disabled={this.disabled}
          onChange={this.handleCheckChange}
        />
      )
    },
  },
  render() {
    return (
      <div
        ref="node$"
        class={[
          bem(),
          {
            expanded: this.expanded,
            current: this.current,
            focusable: !this.disabled,
            checked: !this.disabled && this.checked,
          },
        ]}
        role="treeitem"
        tabindex="-1"
        aria-expanded={this.expanded}
        aria-disabled={this.disabled}
        aria-checked={this.checked}
        data-key={this.node.key}
        onClick={(e) => {e.stopPropagation(); this.handleClick(e)}}
        onContextmenu={this.handleContextMenu}
      >
        <div
          class="vl-tree__content"
          style={{ paddingLeft: `${(this.node.level - 1) * this.indent}px` }}
        >
          <span
            class={[
              'vl-tree__expand-icon',
              {
                'is-leaf':this. node.isLeaf,
                'is-hidden': this.hiddenExpandIcon,
                expanded: !this.node.isLeaf && this.expanded,
              },
            ]}
            onClick={(e) => {e.stopPropagation(); this.handleExpandIconClick(e)}}
          >
            <vl-icon
              node={this.node}
              name="caret-right"
            />
          </span>
          {this.showCheckbox ? this.genCheckbox() : ''}
          <vl-node-content node={this.node} />
        </div>
      </div>
    )
  }
})
