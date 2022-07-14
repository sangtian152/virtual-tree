<script>
// import { useClipboard } from '@vueuse/core'
import Example from './example.vue'
import SourceCode from './source-code.vue'
import ClipboardJS from 'clipboard'
export default {
  name: 'Demo',
  components: {
    Example,
    SourceCode
  },
  props:{
    source: String,
    path: String,
    css: String,
    cssPreProcessor: String,
    js: String,
    html: String,
    demos: Object,
    rawSource: String,
    description: String
  },
  data() {
    return {
      sourceVisible: false
    }
  },
  computed: {
    formatPathDemos() {
      const _demos = {}
      const { demos } = this;
      if (!demos) return {};
      Object.keys(demos).forEach((key) => {
        _demos[key] = demos[key]
      })
      return _demos
    },
    decodedDescription() {
      return decodeURIComponent(this.description)
    }
  },
  methods: {
    setSourceVisible() {
      this.sourceVisible = !this.sourceVisible;
    },
    destoryClipboard() {
      this.clipboard.destroy();
      this.clipboard = null;
    },
    copyCode() {
      if (!this.clipboard) {
        this.clipboard = new ClipboardJS('.copy-btn', {
          text: () => {
            return decodeURIComponent(this.rawSource);
          }
        });
      }
      
      this.clipboard.on('success', (e) => {
        this.$message.success('已复制');
        this.destoryClipboard();
      });
        
      this.clipboard.on('error', (e) => {
        this.$message.error('浏览器不支持自动复制');
        this.destoryClipboard();
      });
      /* const { copy, isSupported } = useClipboard({
        source: decodeURIComponent(props.rawSource),
        read: false,
      })
      if (!isSupported) {
        this.$message.error('浏览器不支持自动复制')
      }
      try {
        await copy()
        this.$message.success('已复制')
      } catch (e) {
        this.$message.error(e.message)
      } */
    }
  }
}

</script>

<template>
  <ClientOnly>
    <div>
      <p text="sm" v-html="decodedDescription" />
      <div class="example">
        <div class="op-btns">
          <el-tooltip
            effect="dark"
            content="复制代码"
            placement="top"
          >
            <div ref="copy-btn" class="copy-btn op-btn" @click="copyCode">
                <span class="el-icon-document-copy"></span>
            </div>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="查看源代码"
            placement="top"
          >
            <div class="op-btn" @click="setSourceVisible">
              <span class="el-icon-view"></span>
            </div>
          </el-tooltip>
        </div>
        <Example :file="path" :demo="formatPathDemos[path]" />
        <!-- <el-divider v-if="sourceVisible" /> -->
        <el-collapse-transition>
          <SourceCode v-show="sourceVisible" :source="source" @hide="setSourceVisible" />
        </el-collapse-transition>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.example {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid #ddd;
    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: #909399;
      transition: 0.2s;
      .iconfont {
          font-size: 22px;
      }
    }
  }
}
</style>
