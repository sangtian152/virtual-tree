import { hasOwn, isClient, isNumber, isString } from '@/utils'
import { createNamespace } from '@/utils/created';
import { useCache } from '../hooks/use-cache'
import useWheel from '../hooks/use-wheel'
import Scrollbar from '../components/scrollbar'
import { getRTLOffsetType, getScrollDir, isHorizontal } from '../utils'
import { virtualizedListProps } from '../props'
import {
  AUTO_ALIGNMENT,
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  ITEM_RENDER_EVT,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_DESC,
  SCROLL_EVT,
} from '../defaults'

const _createNamespace = createNamespace('tree'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1]

const createList = ({
  name,
  getOffset,
  getItemSize,
  getItemOffset,
  getEstimatedTotalSize,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
}) => {
  return createComponent({
    name: name || 'V2VirtualList',
    props: virtualizedListProps,
    data() {
      return {
        dynamicSizeCache: undefined,
        states: {
          isScrolling: false,
          scrollDir: 'forward',
          scrollOffset: isNumber(this.initScrollOffset)
            ? this.initScrollOffset
            : 0,
          updateRequested: false,
          isScrollbarDragging: false,
          scrollbarAlwaysOn: this.scrollbarAlwaysOn,
        }
      }
    },
    computed: {
      itemsToRender() {
        const { total, cache } = this;
        const { isScrolling, scrollDir, scrollOffset } = this.states

        if (total === 0) {
          return [0, 0, 0, 0]
        }

        const startIndex = getStartIndexForOffset(
          this,
          scrollOffset,
          this.dynamicSizeCache
        )
        const stopIndex = getStopIndexForStartIndex(
          this,
          startIndex,
          scrollOffset,
          this.dynamicSizeCache
        )

        const cacheBackward =
          !isScrolling || scrollDir === BACKWARD ? Math.max(1, cache) : 1
        const cacheForward =
          !isScrolling || scrollDir === FORWARD ? Math.max(1, cache) : 1

        return [
          Math.max(0, startIndex - cacheBackward),
          Math.max(0, Math.min(total - 1, stopIndex + cacheForward)),
          startIndex,
          stopIndex,
        ]
      },

      estimatedTotalSize() {
        return getEstimatedTotalSize(this, this.dynamicSizeCache)
      },

      _isHorizontal(){
        return isHorizontal(this.layout)
      },

      windowStyle(){
        return [
          {
            position: 'relative',
            [`overflow-${this._isHorizontal.value ? 'x' : 'y'}`]: 'scroll',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
          },
          {
            direction: this.direction,
            height: isNumber(this.height) ? `${this.height}px` : this.height,
            width: isNumber(this.width) ? `${this.width}px` : this.width,
          },
          this.style,
        ]
      },

      innerStyle() {
        const size = this.estimatedTotalSize
        const horizontal = this._isHorizontal
        return {
          height: horizontal ? '100%' : `${size}px`,
          pointerEvents: this.states.isScrolling ? 'none' : undefined,
          width: horizontal ? `${size}px` : '100%',
        }
      },

      clientSize() {
        return this._isHorizontal ? this.width : this.height
      }
    },
    mounted() {
      this.doMounted()
    },
    updated() {
      this.doUpdated()
    },
    methods: {
      getItemStyleCache: useCache(),
      onWheel() {
        return useWheel(
          {
            atStartEdge: this.states.scrollOffset <= 0,
            atEndEdge: this.states.scrollOffset >= this.estimatedTotalSize,
            layout: this.layout,
          },
          (offset) => {
            this.$refs.scrollbarRef.onMouseUp()
            this.scrollTo(
              Math.min(
                this.states.scrollOffset + offset,
                this.estimatedTotalSize - this.clientSize
              )
            )
          }
        )
      },
      emitEvents() {
        const { total } = this;

        if (total > 0) {
          const [cacheStart, cacheEnd, visibleStart, visibleEnd] =
            this.itemsToRender
          this.$emit(ITEM_RENDER_EVT, cacheStart, cacheEnd, visibleStart, visibleEnd)
        }

        const { scrollDir, scrollOffset, updateRequested } = this.states
        this.$emit(SCROLL_EVT, scrollDir, scrollOffset, updateRequested)
      },

      scrollVertically(e) {
        const { clientHeight, scrollHeight, scrollTop } =
          e.currentTarget
        const _states = this.states
        if (_states.scrollOffset === scrollTop) {
          return
        }

        const scrollOffset = Math.max(
          0,
          Math.min(scrollTop, scrollHeight - clientHeight)
        )

        this.states = {
          ..._states,
          isScrolling: true,
          scrollDir: getScrollDir(_states.scrollOffset, scrollOffset),
          scrollOffset,
          updateRequested: false,
        }

        this.$nextTick(this.resetIsScrolling)
      },

      scrollHorizontally(e) {
        const { clientWidth, scrollLeft, scrollWidth } =
          e.currentTarget
        const _states = this.states

        if (_states.scrollOffset === scrollLeft) {
          return
        }

        const { direction } = this

        let scrollOffset = scrollLeft

        if (direction === RTL) {
          // TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
          // This is not the case for all browsers though (e.g. Chrome reports values as positive, measured relative to the left).
          // It's also easier for this component if we convert offsets to the same format as they would be in for ltr.
          // So the simplest solution is to determine which browser behavior we're dealing with, and convert based on it.
          switch (getRTLOffsetType()) {
            case RTL_OFFSET_NAG: {
              scrollOffset = -scrollLeft
              break
            }
            case RTL_OFFSET_POS_DESC: {
              scrollOffset = scrollWidth - clientWidth - scrollLeft
              break
            }
          }
        }

        scrollOffset = Math.max(
          0,
          Math.min(scrollOffset, scrollWidth - clientWidth)
        )

        this.states = {
          ..._states,
          isScrolling: true,
          scrollDir: getScrollDir(_states.scrollOffset, scrollOffset),
          scrollOffset,
          updateRequested: false,
        }

        this.$nextTick(this.resetIsScrolling)
      },

      onScroll(e) {
        this._isHorizontal ? this.scrollHorizontally(e) : this.scrollVertically(e)
        this.emitEvents()
      },

      onScrollbarScroll (distanceToGo, totalSteps) {
        const offset =
          ((estimatedTotalSize.value - (clientSize.value)) /
            totalSteps) *
          distanceToGo
        this.scrollTo(
          Math.min(
            estimatedTotalSize.value - (clientSize.value),
            offset
          )
        )
      },

      scrollTo(offset) {
        offset = Math.max(offset, 0)

        if (offset === this.states.scrollOffset) {
          return
        }

        this.states = {
          ...this.states,
          scrollOffset: offset,
          scrollDir: getScrollDir(this.states).scrollOffset, offset,
          updateRequested: true,
        }

        this.$nextTick(this.resetIsScrolling)
      },

      scrollToItem (
        idx,
        alignment = AUTO_ALIGNMENT
      ) {
        const { scrollOffset } = this.states

        idx = Math.max(0, Math.min(idx, this.total - 1))
        this.scrollTo(
          getOffset(
            this,
            idx,
            alignment,
            scrollOffset,
            this.dynamicSizeCache
          )
        )
      },

      getItemStyle(idx) {
        const { direction, itemSize, layout } = this

        const itemStyleCache = this.getItemStyleCache({ direction, itemSize, layout })

        let style
        if (hasOwn(itemStyleCache, String(idx))) {
          style = itemStyleCache[idx]
        } else {
          const offset = getItemOffset(this, idx, this.dynamicSizeCache)
          const size = getItemSize(this, idx, this.dynamicSizeCache)
          const horizontal = this._isHorizontal

          const isRtl = direction === RTL
          const offsetHorizontal = horizontal ? offset : 0
          itemStyleCache[idx] = style = {
            position: 'absolute',
            left: isRtl ? undefined : `${offsetHorizontal}px`,
            right: isRtl ? `${offsetHorizontal}px` : undefined,
            top: !horizontal ? `${offset}px` : 0,
            height: !horizontal ? `${size}px` : '100%',
            width: horizontal ? `${size}px` : '100%',
          }
        }

        return style
      },

      // TODO:
      // perf optimization here, reset isScrolling with debounce.

      resetIsScrolling() {
        // timer = null

        this.states.isScrolling = false
        this.$nextTick(() => {
          this.getItemStyleCache(-1, null, null)
        })
      },

      resetScrollTop() {
        const window = this.$refs.windowRef
        if (window) {
          window.scrollTop = 0
        }
      },

      // life cycles
      doMounted() {
        if (!isClient) return
        const { initScrollOffset } = this
        const windowElement = this.$refs.windowRef
        if (isNumber(initScrollOffset) && windowElement) {
          if (this._isHorizontal) {
            windowElement.scrollLeft = initScrollOffset
          } else {
            windowElement.scrollTop = initScrollOffset
          }
        }

        this.emitEvents()
      },

      doUpdated() {
        const { direction, layout } = this
        const { scrollOffset, updateRequested } = this.states
        const windowElement = this.$refs.windowRef

        if (updateRequested && windowElement) {
          if (layout === HORIZONTAL) {
            if (direction === RTL) {
              // TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
              // This is not the case for all browsers though (e.g. Chrome reports values as positive, measured relative to the left).
              // So we need to determine which browser behavior we're dealing with, and mimic it.
              switch (getRTLOffsetType()) {
                case 'negative': {
                  windowElement.scrollLeft = -scrollOffset
                  break
                }
                case 'positive-ascending': {
                  windowElement.scrollLeft = scrollOffset
                  break
                }
                default: {
                  const { clientWidth, scrollWidth } = windowElement
                  windowElement.scrollLeft =
                    scrollWidth - clientWidth - scrollOffset
                  break
                }
              }
            } else {
              windowElement.scrollLeft = scrollOffset
            }
          } else {
            windowElement.scrollTop = scrollOffset
          }
        }
      }
    },

    render(h) {
      const [start, end] = this.itemsToRender

      const Container = this.containerElement
      const Inner = this.innerElement

      const children = []
      if (this.total > 0) {
        const { data, useIsScrolling, states, getItemStyle } = this;
        for (let i = start; i <= end; i++) {
          if (this.$scopedSlots.default) {
            children.push(
              this.$scopedSlots.default({
                node: data[i],
                key: i,
                index: i,
                isScrolling: useIsScrolling ? states.isScrolling : undefined,
                style: getItemStyle(i),
              })
            )
          }
        }
      }

      const InnerNode = [
        h(
          Inner,
          {
            style: this.innerStyle,
            ref: 'innerRef',
          },
          !isString(Inner)
            ? {
                default: () => children,
              }
            : children
        ),
      ]

      const scrollbar = h(Scrollbar, {
        ref: 'scrollbarRef',
        on: {
          scroll: this.onScrollbarScroll
        },
        props: {
          clientSize: this.clientSize,
          layout: this.layout,
          ratio: (this.clientSize * 100) / this.estimatedTotalSize,
          scrollFrom:
          this.states.scrollOffset / (this.estimatedTotalSize - this.clientSize),
          total: this.total,
        },
      })

      const listContainer = h(
        Container,
        {
          class: [bem('window'), 'v2-scrollbar__content', this.className],
          style: this.windowStyle,
          on: {
            scroll: this.onScroll,
            wheel: this.onWheel,
          },
          ref: 'windowRef',
          key: 0,
        },
        !isString(Container) ? { default: () => [InnerNode] } : [InnerNode]
      )

      return h(
        'div',
        {
          key: 0,
          class: ['v2-scrollbar', bem('wrapper'), this.states.scrollbarAlwaysOn ? 'always-on' : ''],
        },
        [listContainer, scrollbar]
      )
    },
  })
}

export default createList
