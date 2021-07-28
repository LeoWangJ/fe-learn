<template>
  <div
    ref="container"
    class="manga-reader-container"
  >
    <div
      class="pages"
      :style="pageContainerStyle"
    >
      <div
        class="page-wrap"
        v-for="data in pageDataList"
        :key="data.key"
        :style="data.wrapStyle"
      >
        <div
          class="page"
          :class="{ loading: !data.loaded }"
          :data-page="data.key"
        >
          <div
            v-if="!data.errored"
            class="item"
            :style="data.style"
          >
            <slot
              name="image"
              :data="data"
              :onLoad="onLoad.bind(null, data.key)"
              :onError="onError.bind(null, data.key)"
            >
              <img
                :key="data.imageKey"
                :src="data.src"
                alt=""
                @load="onLoad(data.key, $event)"
                @error="onError(data.key, $event)"
              >
            </slot>
          </div>
        </div>
        <div
          v-if="!data.loaded && !data.errored"
          class="load-indicator"
        >
          正在加载第{{ data.key + 1 }}页...
          <div class="hang-top">
            <img
              class="loading-icon"
              src="~assets/reader/loading-icon.svg"
              alt="loading"
            >
          </div>
        </div>
        <div
          v-if="data.errored"
          class="error-indicator"
        >
          加载失败
          <div class="hang-top number">
            {{ data.key + 1 }}
          </div>
        </div>
        <button
          v-if="data.errored"
          class="reload"
        >
          点击重试
        </button>
      </div>
    </div>
    <div
      class="notification"
      :class="{ show: notification }"
    >
      {{ notificationText }}
    </div>
    <div
      v-if="urls.length > 0"
      ref="target"
      class="overlay"
      @touchstart.passive="
        ignoreMouseEvent = true
        onTouchStart($event)
      "
      @touchmove.passive="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @mousedown.passive="onMouseDown"
      @mousemove.passive="onMouseMove"
      @mouseup.passive="onMouseUp"
      @mouseout.passive="onMouseUp"
      @wheel.passive="onWheel"
    />
    <div
      v-else
      class="overlay"
    />
    <q-resize-observer @resize="onResize" />
  </div>
</template>
<script>
import { Page, machine, getPointer, toPosition } from './reader-utils'

// MUST be synchronized with css
const RELOAD_BUTTON_HEIGHT = 32
const RELOAD_BUTTON_WIDTH = 168
const RELOAD_BUTTON_BOTTOM = 64
const RELOAD_BUTTON_OUTLET = 4

const PRELOAD_RANGE = 2

export default {
  name: 'Reader',
  props: {
    urls: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    const data = {
      notification: false,
      notificationTimer: null,
      notificationText: '',
      ignoreMouseEvent: false,
      mouseIsDown: false,
      machineState: 'INITIAL',
      pointers: [],
      stage: {
        get page () {
          return data.stage.pages[data.stage.pageIndex]
        },
        width: null,
        height: null,
        firstPoint: null,
        secondPoint: null,
        transition: false,
        pageIndex: 0,
        pageVisualIndex: 0,
        pages: [],
        $click: pos => this.onEmitClick(pos),
        $hitStart: () => this.onHitStart(),
        $hitEnd: () => this.onHitEnd()
      }
    }

    return data
  },

  computed: {
    pageContainerStyle () {
      const pagesElTransform = `translateX(${this.stage.pageVisualIndex * this.stage.width * -1}px)`
      const style = {
        transform: pagesElTransform
      }

      if (this.stage.transition) {
        style.transition = 'all .2s'
      }
      return style
    },
    pageDataList () {
      const dataList = []

      const currentIndex = this.stage.pageIndex

      const startIndex = Math.max(0, currentIndex - PRELOAD_RANGE)
      const endIndex = Math.min(this.stage.pages.length - 1, currentIndex + PRELOAD_RANGE)

      for (let i = startIndex; i <= endIndex; i++) {
        const style = {}
        const transform = `translate(${this.stage.pages[i].offsetX}px, ${this.stage.pages[i].offsetY}px) scale(${this.stage.pages[i].scale})`
        const size = this.stage.pages[i].getFitSize(this.stage.width, this.stage.height)
        style.transform = transform
        style.width = size.width + 'px'
        style.height = size.height + 'px'

        const wrapStyle = {
          height: this.stage.height,
          width: this.stage.width,
          top: '0px',
          left: i * this.stage.width + 'px'
        }

        dataList.push({
          key: i,
          imageKey: `image-${i}-r${this.stage.pages[i].retry}`,
          loaded: this.stage.pages[i].loaded,
          errored: this.stage.pages[i].errored,
          style,
          wrapStyle,
          src: this.stage.pages[i].url
        })
      }

      return dataList
    }
  },

  watch: {
    'stage.pageIndex': {
      immediate: true,
      handler (val) {
        this.$emit('page', val)
      }
    },
    urls (newVal, oldVal) {
      if (newVal.join('\u0000') !== oldVal.join('\u0000')) {
        if (newVal.length > 0) {
          this.init()
        }
      }
    }
  },

  methods: {
    run (ev, data) {
      if (machine[this.machineState][ev] === null) {
        // current state does not handle such action
        return
      }

      const nextState = machine[this.machineState][ev](this.stage, data)

      if (nextState != null) {
        this.machineState = nextState

        machine[nextState].$enter(this.stage)
      }
    },
    onTouchStart (ev) {
      const changed = ev.changedTouches

      const changedPointers = []

      for (const item of Array.from(changed)) {
        const pointer = getPointer(item.identifier, toPosition(item, this.$refs.target))
        this.pointers.push(pointer)
        changedPointers.push(pointer)
      }

      this.run('handleTouchStart', { pointers: this.pointers, changed: changedPointers })
    },
    onTouchMove (ev) {
      const changed = ev.changedTouches

      const changedPointers = []

      for (const item of Array.from(changed)) {
        const id = item.identifier
        const pos = toPosition(item, this.$refs.target)

        const itemPos = this.pointers.find(i => i.id === id)
        const index = itemPos ? this.pointers.indexOf(itemPos) : -1

        if (index >= 0) {
          changedPointers.push(this.pointers[index])
          this.pointers[index].events.push([Date.now(), pos])
          if (this.pointers[index].events.length > 20) {
            this.pointers[index].events.shift()
          }
          this.pointers[index].end = pos
        }
      }

      this.run('handleTouchMove', { pointers: this.pointers, changed: changedPointers })
    },
    onTouchEnd (ev) {
      const changed = ev.changedTouches

      const changedPointers = []

      for (const item of Array.from(changed)) {
        const id = item.identifier

        const itemPos = this.pointers.find(i => i.id === id)
        const index = itemPos ? this.pointers.indexOf(itemPos) : -1

        if (index >= 0) {
          changedPointers.push(this.pointers[index])
          this.pointers.splice(index, 1)
        }
      }

      this.run('handleTouchEnd', { pointers: this.pointers, changed: changedPointers })
    },
    /**
     * @param {MouseEvent} ev
     */
    onMouseDown (ev) {
      if (this.ignoreMouseEvent) return

      this.mouseIsDown = true

      const simulatedEvent = {
        changedTouches: [
          {
            identifier: 'm1',
            clientX: ev.clientX,
            clientY: ev.clientY
          }
        ]
      }

      this.onTouchStart(simulatedEvent)
    },
    /**
     * @param {MouseEvent} ev
     */
    onMouseMove (ev) {
      if (this.ignoreMouseEvent) return

      if (!this.mouseIsDown) return

      const simulatedEvent = {
        changedTouches: [
          {
            identifier: 'm1',
            clientX: ev.clientX,
            clientY: ev.clientY
          }
        ]
      }

      this.onTouchMove(simulatedEvent)
    },
    /**
     * @param {MouseEvent} ev
     */
    onMouseUp (ev) {
      if (this.ignoreMouseEvent) return

      if (!this.mouseIsDown) {
        return
      }

      this.mouseIsDown = false

      const simulatedEvent = {
        changedTouches: [
          {
            identifier: 'm1',
            clientX: ev.clientX,
            clientY: ev.clientY
          }
        ]
      }

      // this.onTouchMove(simulatedEvent)
      this.onTouchEnd(simulatedEvent)
    },
    /**
     * @param  {WheelEvent} ev
     */
    onWheel (ev) {
      const simulatedTouch = {
        identifier: 'm1',
        clientX: ev.clientX,
        clientY: ev.clientY
      }

      const pos = toPosition(simulatedTouch, this.$refs.target)

      this.run('handleWheel', { pointers: this.pointers, pos, deltaY: ev.deltaY })
    },
    onResize ({ width, height }) {
      // so it will not result in weird effect
      this.stage.transition = false
      this.stage.width = width
      this.stage.height = height
    },
    onLoad (key, ev) {
      /**
       * @type { HTMLImageElement }
       */
      const target = ev.target
      const height = target.naturalHeight
      const width = target.naturalWidth

      this.stage.pages[key].loaded = true
      this.stage.pages[key].height = height
      this.stage.pages[key].width = width
    },
    onError (key, ev) {
      this.stage.pages[key].errored = true
    },
    onEmitClick (pos) {
      if (this.stage.page.errored) {
        const stage = this.stage
        const clickX = pos.x * stage.width
        const clickY = pos.y * stage.height
        const bx1 = stage.width / 2 - RELOAD_BUTTON_WIDTH / 2 - RELOAD_BUTTON_OUTLET
        const bx2 = stage.width / 2 + RELOAD_BUTTON_WIDTH / 2 + RELOAD_BUTTON_OUTLET
        const by1 = stage.height - RELOAD_BUTTON_BOTTOM - RELOAD_BUTTON_HEIGHT - RELOAD_BUTTON_OUTLET
        const by2 = stage.height - RELOAD_BUTTON_BOTTOM + RELOAD_BUTTON_OUTLET

        if (clickX >= bx1 && clickX <= bx2 && clickY >= by1 && clickY <= by2) {
          this.stage.page.errored = false
          this.stage.page.retry++

          return
        }
      }

      this.$emit('click', pos, this)
    },
    nextPage (animated) {
      if (this.stage.pageIndex < this.stage.pages.length - 1) {
        this.stage.pageIndex = this.stage.pageIndex + 1
        this.stage.pageVisualIndex = this.stage.pageIndex

        this.stage.page.scale = 1
        this.stage.page.fixPosition(this.stage.width, this.stage.height)

        this.stage.transition = true
      } else {
        this.notify('已经是最后一页啰')
      }
    },
    prevPage (animated) {
      if (this.stage.pageIndex > 0) {
        this.stage.pageIndex = this.stage.pageIndex - 1
        this.stage.pageVisualIndex = this.stage.pageIndex

        this.stage.page.scale = 1
        this.stage.page.fixPosition(this.stage.width, this.stage.height)

        this.stage.transition = animated
      } else {
        this.notify('已经是第一页啰')
      }
    },
    jumpToPage (index) {
      const target = Math.max(0, Math.min(this.stage.pages.length - 1, index))

      if (index === target) {
        this.stage.pageIndex = target
        this.stage.pageVisualIndex = this.stage.pageIndex

        this.stage.page.scale = 1
        this.stage.page.fixPosition(this.stage.width, this.stage.height)

        // we don't want animation here
        this.stage.transition = true
      }
    },
    notify (text) {
      clearTimeout(this.notificationTimer)
      this.notificationText = text

      this.notification = true
      this.notificationTimer = setTimeout(() => {
        this.notification = false
      }, 1000)
    },
    onHitStart () {
      this.notify('已经是第一页啰')
    },
    onHitEnd () {
      this.notify('已经是最后一页啰')
    },
    init () {
      this.machineState = 'INITIAL'
      this.stage.transition = false
      this.stage.pageIndex = 0
      this.stage.pageVisualIndex = 0

      const pages = []

      for (const url of this.urls) {
        pages.push(new Page(1, 1, { url }))
      }

      this.stage.pages = pages

      machine[this.machineState].$enter(this.stage)
    }
  },

  mounted () {
    if (this.urls.length > 0) {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
// must be synchronize with js above
$RELOAD_BUTTON_HEIGHT: 32px;
$RELOAD_BUTTON_WIDTH: 168px;
$RELOAD_BUTTON_BOTTOM: 64px;

.manga-reader-container {
  position: relative;
  background: black;
  overflow: hidden;
  user-select: none;
}

.pages {
  height: 100%;
  // display: flex;
  flex-wrap: nowrap;
}

.page-wrap {
  flex-shrink: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  float: left;
  overflow: hidden;
  position: absolute;
}

.page {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.load-indicator, .error-indicator {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  white-space: nowrap;

  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.14;
  letter-spacing: 0.35px;
  text-align: center;
  color: #ffffff;
}

.hang-top {
  position: absolute;
  bottom: calc(100% + 40px);
  left: 50%;
  transform: translate(-50%, 50%);
}

.load-indicator .loading-icon {
  animation-name:rotation;
  animation-duration:1s;
  animation-iteration-count: infinite;
  animation-timing-function: steps(8, start);
}

@keyframes rotation {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}

.error-indicator .number {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  font-size: 64px;
  font-weight: 300;
  letter-spacing: 1.6px;
  color: #ff962c;
}

.page.loading {
  .item {
    width: 1px !important;
    height: 1px !important;
    opacity: 0.01;
  }
}

.item {
  width: 300px;
  height: 300px;
  background: grey;
  position: relative;
}

.item img {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  touch-action: none;
}

.reload {
  position: absolute;
  bottom: $RELOAD_BUTTON_BOTTOM;
  left: 50%;
  transform: translateX(-50%);

  width: $RELOAD_BUTTON_WIDTH;
  height: $RELOAD_BUTTON_HEIGHT;
  border-radius: 5px;

  padding: 0;
  border: solid 1px #ffffff;
  background: transparent;

  font-size: 14px;
  line-height: ($RELOAD_BUTTON_HEIGHT - 2px);
  color: #ffffff;
}

.notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 24px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.8);

  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 1.14;
  letter-spacing: 0.35px;
  text-align: center;
  color: #ffffff;

  transition: opacity .3s;
  opacity: 0;
  &.show {
    opacity: 1;
  }
}
</style>
