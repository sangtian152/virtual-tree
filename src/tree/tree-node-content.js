import { createNamespace } from '@/utils/created';

export default {
  name: 'V2TreeNodeContent',
  functional: true,
  render(h, context) {
    const bem = createNamespace('tree')[1]
    const { props } = context
    const node = props.node
    const { data } = node
    return context.scopedSlots.default
      ? context.scopedSlots.default({ node, data })
      : h('span', { class:bem('label') }, [node.label])
  },
}
