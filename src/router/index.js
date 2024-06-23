import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectView from "../views/ProjectView.vue";
import ProjectSettingView from "../views/ProjectSettingView.vue";
import MemoHomeView from "../views/MemoHomeView.vue";
import MemoContentView from "../views/MemoContentView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/project/:id",
    name: "project",
    component: ProjectView,
  },
  {
    path: "/project",
    name: "project",
    component: ProjectView,
  },
  {
    path: "/projectsetting/:id",
    name: "projectsetting",
    component: ProjectSettingView,
  },
  {
    path: "/projectsetting",
    name: "projectsetting",
    component: ProjectSettingView,
  },
  {
    path: "/memo",
    name: "memo",
    component: MemoHomeView,
  },
  {
    path: "/memo/content/:id",
    name: "memo contents",
    component: MemoContentView,
  },
  {
    path: "/memo/content",
    name: "memo contents",
    component: MemoContentView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
