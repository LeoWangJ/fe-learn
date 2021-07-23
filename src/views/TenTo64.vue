<template>
  <div class="tenTo64">
    10 進位： <input v-model="inputNumber" />
    <br />
    <button @click="transHandler">開始計算</button>
    <br />
    64 進位： {{ result }}
  </div>
</template>

<script>
const DEFINE =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+".split("");
console.log(DEFINE);
export default {
  name: "TenTo64",
  components: {},
  data() {
    return {
      result: null,
      inputNumber: null,
    };
  },
  methods: {
    /**
     * 十進位轉64進位
     * 處理整數, 除64後取餘數, 之後記得將值反轉
     * 處理小數, 乘64後取整數, 再繼續對小數做乘64, 直到小數為0或者溢位
     */
    transHandler() {
      let result = [];
      let sign = this.inputNumber > 0 ? "" : "-";
      let decimal = Math.abs(this.inputNumber) % 1;
      let integer = Math.abs(this.inputNumber) - decimal;

      // 處理整數
      while (integer > 0) {
        let store = integer > 64 ? integer % 64 : integer;
        result.push(DEFINE[store]);
        integer = Math.floor(integer / 64);
      }

      result.reverse();

      // 處理小數
      while (decimal > 0) {
        decimal = decimal * 64;
        let tempDecimal = decimal % 1;
        let tempInteger = Math.abs(decimal) - tempDecimal;
        result.push(DEFINE[tempInteger]);
        decimal = tempDecimal;
      }

      this.result = sign + result.join("");
    },
  },
};
</script>

<style scoped>
.tenTo64 {
  text-align: left;
}
</style>
