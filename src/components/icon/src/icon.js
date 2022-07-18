import { createNamespace } from '@/utils/created';
const _createNamespace = createNamespace('icon'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1]
export default createComponent({
  props: {
    name: String
  },
  render() {
    return (
      <i 
        class={bem(this.name)}></i>
    )
  }
});
