<template>
  <div>
    <h1>前端基礎</h1>
    <h2>課堂練習</h2>
    <div class="menu">
      <router-link class="item" to="tento64">十進位轉64進位</router-link>
    </div>
    <h2>作業</h2>
    <div class="menu">
      <router-link class="item" to="tento64">十進位轉64進位</router-link>
      <router-link class="item" to="picture-to-grayscale">圖片轉換成灰度圖</router-link>
      <router-link class="item" to="monaco-editor">monaco-editor</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>

<style scoped>
.menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.item {
  border: 1px #e0e0e0 solid;
  background: #f0f0f0;
  width: 200px;
  height: 100px;
  margin: 10px;
  border-radius: 6px;
}
</style>
