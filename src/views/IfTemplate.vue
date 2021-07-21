<template>
  <div></div>
</template>

<script>
// @ is an alias to /src
import { V1 } from "@/components/ifTemplate";
import NewsList from "@/components/ifTemplate/components/NewsList.js";

export default {
  name: "IfTemplate",
  data() {
    return {
      info: {
        showImage: true,
        showDate: true,
        name: "test",
      },
      image:
        "http://dingyue.ws.126.net/2021/0201/b63f2e50j00qntwfh0020c000hs00npg.jpg?imageView&thumbnail=140y88&quality=85",
    };
  },
  mounted() {
    const v1 = new V1().mounted(this.$el);
    console.log(v1, NewsList);
    v1.render(NewsList, { info: this.info, image: this.image });
  },
};
</script>

<style scoped>
.news-item {
  display: flex;
  width: 600px;
  height: 100px;
  justify-content: space-between;
}
</style>
