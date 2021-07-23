<template>
  <div
    ref="container"
    class="monaco-editor"
    :style="{
      height: `${height}px`,
      width: `${width}px`,
    }"
  ></div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  name: "monaco",
  props: {
    opts: {
      type: Object,
      default() {
        return {};
      },
    },
    height: {
      type: Number,
      default: 700,
    },
    width: {
      type: Number,
      default: 700,
    },
  },
  data() {
    return {
      defaultOpts: {
        value: "",
        theme: "vs-dark",
        autoIndent: true,
      },
    };
  },
  watch: {
    opts: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.container.innerHTML = "";
      this.editorOptions = Object.assign(this.defaultOpts, this.opts);
      this.monacoEditor = monaco.editor.create(
        this.$refs.container,
        this.editorOptions
      );
      this.monacoEditor.onDidChangeModelContent(() => {
        this.$emit("change", this.monacoEditor.getValue());
      });
    },
    getVal() {
      return this.monacoEditor.getValue();
    },
    setVal(value) {
      this.monacoEditor.setValue(value);
    },
  },
};
</script>

<style></style>
