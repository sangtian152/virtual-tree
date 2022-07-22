import { createNamespace } from "@/utils/created";
const _createNamespace = createNamespace("icon"),
  createComponent = _createNamespace[0],
  bem = _createNamespace[1];
export default createComponent({
  props: {
    name: String,
    node: Object,
  },
  inject: ["treeSlot"],
  render() {
    const { node } = this;
    const { data } = this.node;
    return this.treeSlot.icon ? (
      this.treeSlot.icon({ node, data })
    ) : (
      <i class={bem(this.name)}></i>
    );
  },
});
