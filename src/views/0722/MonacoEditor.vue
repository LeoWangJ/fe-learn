<template>
  <div>
    <div class="monaco-wrap">
      <div class="btn-wrap">
        <input type="file" ref="file" @change="fileHandler" />
        <div @click="viewHandler" class="view">即時預覽</div>
      </div>
      <monaco ref="monaco" :opts="opts" @change="changeValue"></monaco>
    </div>
    <iframe id="view-iframe"> </iframe>
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
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
      },
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
      console.log(data);
      fetch(`${process.env.VUE_APP_SERVER}/upload`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          console.log(res.data);
          let iframe = document.getElementById("view-iframe");
          iframe.src = res.data.url;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.monaco-wrap {
  width: 700px;
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
