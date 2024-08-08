import { createRouter, createWebHistory } from "vue-router";

const routes = [{
    name: "index",
    path: "/",
    component: () => import('../views/Test01.vue')
}]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router