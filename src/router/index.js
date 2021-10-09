import { createRouter, createWebHistory } from 'vue-router'
import backstage from '@/router/backstage'
const routes = [{
    path: "/",
    component: () =>
        import("@/components/reception/TikHome.vue"),
    children: [{
        path: "",
        component: () =>
            import("@/components/reception/TikContent.vue"),
        children: [{
            path: "problemlist/:id",
            component: () =>
                import("@/view/reception/TikProblems.vue")
        },
        {
            path: "/problem/:id",
            component: () =>
                import("@/view/reception/TikProblemDetail.vue")
        }, {
            path: "/problem-collection",
            component: () =>
                import("@/view/reception/TikProblemCollections.vue")
        }
        ]
    }],

}
    , {
    path: "/login",
    component: () =>
        import("@/view/reception/Login.vue")
}
    , backstage]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
export default router