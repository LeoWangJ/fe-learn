<template>
  <div class="wrap">
    <div class="monaco-wrap">
      <div class="btn-wrap">
        <input type="file" ref="file" @change="fileHandler" />
        <div @click="viewHandler" class="view">即時預覽</div>
      </div>
      <monaco ref="monaco" :opts="opts" @change="changeValue"></monaco>
    </div>
    <div v-if="error">{{ error }}</div>
    <template v-else>
      <template v-if="loading">編譯中... </template>
      <template v-else>
        <iframe ref="viewIframe" width="700px"></iframe>
      </template>
    </template>
  </div>
</template>

<script>
import monaco from "@/components/monacoEditor/Index";
export default {
  name: "MonacoEditor",
  components: { monaco },
  data() {
    return {
      opts: {
        value: "",
        language: "html",
        theme: "vs-dark",
        automaticLayout: true,
      },
      error: "",
      loading: false,
    };
  },
  methods: {
    fileHandler(event) {
      const input = event.target;
      if (input.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filename = input.files[0].name;
          this.setValue(e.target.result);
        };
        reader.readAsText(input.files[0]);
      }
    },
    getValue() {
      return this.$refs.monaco.getVal();
    },
    setValue(value) {
      this.$refs.monaco.setVal(value);
    },
    changeValue(val) {
      console.log(val);
    },
    viewHandler() {
      const data = {
        text: this.getValue(),
      };
      this.error = "";
      this.loading = true;
      fetch(`${process.env.VUE_APP_SERVER}/upload`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.loading = false;
          if (res.code === 200) {
            this.$nextTick(() => {
              let iframe = this.$refs.viewIframe;
              iframe.src = res.url;
            });
          } else {
            this.error = "出錯了...";
          }
        })
        .catch(() => {
          this.error = "出錯了...";
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.wrap {
  display: flex;
}
.monaco-wrap {
  width: 700px;
  margin-right: 10px;
}

.btn-wrap {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
}

.view {
  border: #000 1px solid;
  width: 100px;
  cursor: pointer;
  text-align: center;
}
</style>
