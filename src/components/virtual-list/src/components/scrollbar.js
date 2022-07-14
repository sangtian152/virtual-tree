import { BAR_MAP } from '../utils'
import { cAF, rAF } from '@/utils'
import { createNamespace } from '@/utils/created';
import { HORIZONTAL, SCROLLBAR_MIN_SIZE, ScrollbarDirKey } from '../defaults'
import { virtualizedScrollbarProps } from '../props'
import { renderThumbStyle } from '../utils'

const _createNamespace = createNamespace('scrollbar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1]

const ScrollBar = createComponent({
  name: 'ElVirtualScrollBar',
  props: virtualizedScrollbarProps,
  data() {
    return {
      onselectstartStore: null,
      frameHandle: null,
      state: {
        isDragging: false,
        traveled: 0,
      }
    }
  },
  computed: {
    bar() {
      return BAR_MAP[this.layout]
    },
    GAP() {
      return this.startGap + this.endGap // top 2 + bottom 2 | left 2 + right 2
    },
    trackSize() {
      return this.clientSize - this.GAP
    },

    trackStyle(){
      return {
        position: 'absolute',
        width: `${
          HORIZONTAL === this.layout ? this.trackSize : this.scrollbarSize
        }px`,
        height: `${
          HORIZONTAL === this.layout ? this.scrollbarSize : this.trackSize
        }px`,
        [ScrollbarDirKey[this.layout]]: '2px',
        right: '2px',
        bottom: '2px',
        borderRadius: '4px',
      }
    },

    thumbSize() {
      const ratio = this.ratio
      const clientSize = this.clientSize
      if (ratio >= 100) {
        return Number.POSITIVE_INFINITY
      }

      if (ratio >= 50) {
        return (ratio * clientSize) / 100
      }

      const SCROLLBAR_MAX_SIZE = clientSize / 3
      return Math.floor(
        Math.min(
          Math.max(ratio * clientSize, SCROLLBAR_MIN_SIZE),
          SCROLLBAR_MAX_SIZE
        )
      )
    },

    // const sizeRange = computed(() => this.size - this.thumbSize)

    thumbStyle() {
      if (!Number.isFinite(this.thumbSize)) {
        return {
          display: 'none',
        }
      }

      const thumb = `${this.thumbSize}px`

      const style = renderThumbStyle(
        {
          bar: this.bar,
          size: thumb,
          move: this.state.traveled,
        },
        this.layout
      )

      return style
    },

    totalSteps() {
      return Math.floor(this.clientSize - this.thumbSize - this.GAP)
    }
  },
  watch: {
    scrollFrom(v) {
      if (this.state.isDragging) return
      /**
       *  this is simply mapping the current scrollbar offset
       *
       *  formula 1:
       *    v = scrollOffset / (estimatedTotalSize - clientSize)
       *    traveled = v * (clientSize - thumbSize - GAP) --> v * totalSteps
       *
       *  formula 2:
       *    traveled = (v * clientSize) / (clientSize / totalSteps) --> (v * clientSize) * (totalSteps / clientSize) --> v * totalSteps
       */
       this.state.traveled = Math.ceil(v * this.totalSteps)
    }
  },
  beforeDestroy() {
    this.detachEvents()
  },
  methods: {
    attachEvents() {
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)

      const thumbEl = this.$refs.thumbRef

      if (!thumbEl) return

      this.onselectstartStore = document.onselectstart
      document.onselectstart = () => false

      thumbEl.addEventListener('touchmove', this.onMouseMove)
      thumbEl.addEventListener('touchend', this.onMouseUp)
    },

    detachEvents () {
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)

      document.onselectstart = this.onselectstartStore
      this.onselectstartStore = null

      const thumbEl = this.$refs.thumbRef
      if (!thumbEl) return

      thumbEl.removeEventListener('touchmove', this.onMouseMove)
      thumbEl.removeEventListener('touchend', this.onMouseUp)
    },

    onThumbMouseDown (e) {
      e.stopImmediatePropagation()
      if (
        (e).ctrlKey ||
        [1, 2].includes((e).button)
      ) {
        return
      }

      this.state.isDragging = true
      this.state[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] -
          (e.currentTarget).getBoundingClientRect()[
            this.bar.direction
          ])

      this.$emit('start-move')
      attachEvents()
    },

    onMouseUp(){
      this.state.isDragging = false
      this.state[this.bar.axis] = 0
      this.$emit('stop-move')
      detachEvents()
    },

    onMouseMove(e) {
      const { isDragging } = this.state
      if (!isDragging) return
      if (!this.$refs.thumbRef || !this.$refs.trackRef) return

      const prevPage = this.state[this.bar.axis]
      if (!prevPage) return

      cAF(this.frameHandle)
      // using the current track's offset top/left - the current pointer's clientY/clientX
      // to get the relative position of the pointer to the track.
      const offset =
        (trackRef.value.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]) *
        -1

      // find where the thumb was clicked on.
      const thumbClickPosition = this.$refs.thumbRef[this.bar.offset] - prevPage
      /**
       *  +--------------+                                   +--------------+
       *  |              -  <--------- thumb.offsetTop       |              |
       *  |             |+|             <--+                 |              |
       *  |              -                 |                 |              |
       *  |   Content    |                 |                 |              |
       *  |              |                 |                 |              |
       *  |              |                 |                 |              |
       *  |              |                 |                 |              -
       *  |              |                 +-->              |             |+|
       *  |              |                                   |              -
       *  +--------------+                                   +--------------+
       */

      // using the current position - prev position to

      const distance = offset - thumbClickPosition
      // get how many steps in total.
      // gap of 2 on top, 2 on bottom, in total 4.
      // using totalSteps ÷ totalSize getting each step's size * distance to get the new
      // scroll offset to scrollTo
      this.frameHandle = rAF(() => {
        this.state.traveled = Math.max(
          this.startGap,
          Math.min(
            distance,
            this.totalSteps // 2 is the top value
          )
        )
        this.$emit('scroll', distance, this.totalSteps)
      })
    },

    clickTrackHandler(e) {
      const offset = Math.abs(
        (e.target).getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]
      )
      const thumbHalf = this.$refs.thumbRef[this.bar.offset] / 2
      const distance = offset - thumbHalf

      this.state.traveled = Math.max(0, Math.min(distance, this.totalSteps))
      this.$emit('scroll', distance, this.totalSteps)
    }
  },
  render(h) {
      return h(
        'div',
        {
          role: 'presentation',
          ref: 'trackRef',
          class: [
            bem('virtual'),
            this.className,
            (this.alwaysOn || this.state.isDragging) && 'always-on',
          ],
          style: this.trackStyle,
          on: {
            mousedown: (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.clickTrackHandler(e)
            },
            touchstartPrevent: this.onThumbMouseDown,
          },
        },
        [h(
          'div',
          {
            ref: 'thumbRef',
            class: bem('thumb'),
            style: this.thumbStyle,
            on: {
              mousedown: this.onThumbMouseDown
            },
          },
          []
        )]
      )
  }
})

export default ScrollBar
