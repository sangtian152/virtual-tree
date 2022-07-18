import { createNamespace } from '@/utils/created';
const _createNamespace = createNamespace('tree-node'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1]
export default createComponent({
  props: {
    node: Object
  },
  render() {
    const { node } = this;
    const { data } = this.node;
    return this.slots('default', { node, data }) ||
      (
        <span
          class={bem('label')}>{node.label}</span>
      )
  },
})
