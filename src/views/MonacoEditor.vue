<template>
  <div>
    <input type="file" ref="file" @change="fileHandler" />
    <monaco ref="monaco" :opts="opts" @change="changeValue"></monaco>
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
      let input = event.target;
      if (input.files) {
        let reader = new FileReader();
        reader.onload = (e) => {
          console.log(input.files);
          this.setValue(e.target.result);
        };
        reader.readAsText(input.files[0]);
      }
    },
    getValue() {
      console.log(this.$refs.monaco.getVal());
    },
    setValue(value) {
      this.$refs.monaco.setVal(value);
    },
    changeValue(val) {
      console.log(val);
    },
  },
};
</script>

<style></style>
