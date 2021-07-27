import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/tento64",
    name: "TenTo64",
    component: () => import("../views/TenTo64.vue"),
  },
  {
    path: "/monaco-editor",
    name: "MonacoEditor",
    component: () => import("../views/0722/MonacoEditor.vue"),
  },
  {
    path: "/picture-to-grayscale",
    name: "PictureToGrayscale",
    component: () => import("../views/PictureToGrayscale.vue"),
  },
  {
    path: "/if-template",
    name: "IfTemplate",
    component: () => import("../views/IfTemplate.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
