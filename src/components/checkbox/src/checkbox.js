import { createNamespace } from '@/utils/created';
const _createNamespace = createNamespace('checkbox'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1]
  export default createComponent({
    data() {
      return {
        selfModel: false,
        focus: false,
        bem: bem
      };
    },

    computed: {
      model: {
        get() {
          return this.value !== undefined
              ? this.value : this.selfModel;
        },

        set(val) {
          this.$emit('input', val);
          this.selfModel = val;
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        }
      },

      store() {
        return this.value;
      }
    },

    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
    },

    methods: {
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = true;
        }
      },
      genInput() {
        return (
          <input
            class={bem('original')}
            type="checkbox"
            disabled={this.disabled}
            name={this.name}
            checked={this.model}
            aria-hidden={this.indeterminate ? 'true' : 'false'}
            value={this.label}
            onChange={this.handleChange}
            onFocus={() => { this.focus = true }}
            onBlur={() => { this.focus = false }}
          />
        )
      },
      genIcon() {
        return (
          <span
            class={bem('inner')}
            >
          </span>
        )
      },
      genInner() {
        const Children = [this.genInput(), this.genIcon()]
        return (
            <span
              class={[
                bem('input'),
                {
                  'is-disabled': this.disabled,
                  'is-checked': this.isChecked,
                  'is-indeterminate': this.indeterminate,
                  'is-focus': this.focus
                }]}
                tabindex={this.indeterminate ? 0 : false}
                role={this.indeterminate ? 'checkbox' : false}
                aria-checked={this.indeterminate ? 'mixed' : false}
              >
                {Children}
              </span>
          )
      },
      handleChange(ev) {
        this.$emit('change', ev.target.checked, ev);
      }
    },

    created() {
      this.checked && this.addToStore();
    },
    mounted() { // 为indeterminate元素 添加aria-controls 属性
      if (this.indeterminate) {
        this.$el.setAttribute('aria-controls', this.controls);
      }
    },
    render(){
      const innerEl = this.genInner()
      return (
        <label
          class={[
            bem(),
            { 'is-disabled': this.disabled },
            { 'is-checked': this.isChecked }
          ]}
          id={this.id}
        > 
          {innerEl}
        </label>)
    }
  });
