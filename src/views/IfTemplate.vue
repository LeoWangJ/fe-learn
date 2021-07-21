<template>
  <div></div>
</template>

<script>
// @ is an alias to /src
import { V1 } from "@/components/ifTemplate";

export default {
  name: "IfTemplate",
  mounted() {
    const v1 = new V1().mounted(this.$el);
    let tmpl = `<div class="newslist">
        <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
        <div class="date" v-if="info.showDate">info.showDate: {{info.name}}</div>
        <div class="img">{{info.name}}</div>
        <div class="date" v-if="info.showName.showName">info.showName.showName: {{info.name}}</div>
        <div class="date" v-if="show">show:{{info.name}}</div>
    </div>`;

    v1.render(tmpl, {
      image:
        "http://dingyue.ws.126.net/2021/0201/b63f2e50j00qntwfh0020c000hs00npg.jpg?imageView&thumbnail=140y88&quality=85",
      info: {
        showImage: true,
        showDate: false,
        name: "aaa",
        showName: { showName: true },
      },
      show: true,
    });
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
