import { createRouter, createWebHistory } from 'vue-router'
import backstage from '@/router/backstage'
import group from '@/router/group'
import groups from '@/router/groups'
const routes = [{
    path: "/redirect",
    component: () =>
        import("@/view/redirect.vue"),
}, {
    path: "/",
    component: () =>
        import("@/components/reception/TikHome.vue"),
    children: [{
        path: "",
        component: () =>
            import("@/components/reception/TikContent.vue"),
        redirect: "problem-collection",
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
        }, {
            path: "/problemDetail/:collectionid",
            component: () =>
                import("@/view/reception/AddProblemDetail.vue")
        }, {
            path: "/problemDetail/update/:problemid",
            component: () =>
                import("@/view/reception/AddProblemDetail.vue")
        },
        {
            path: "/addSolution/:problemId",
            component: () =>
                import("@/view/reception/AddSolution.vue")
        }, {
            path: "/solution/:solutionId",
            component: () =>
                import("@/view/reception/Solution.vue")
        }, {
            path: "/personCenter",
            component: () =>
                import("@/view/reception/PersonCenter.vue"),
            redirect: "/personCenter/account",
            children: [
                {
                    path: "account",
                    component: () =>
                        import("@/components/reception/person_center/Account.vue"),
                }

            ]
        }, group, groups
        ]
    }],
}, {
    path: "/login",
    component: () =>
        import("@/view/reception/Login.vue")
}
    , {
    path: "/passwordrest",
    component: () =>
        import("@/view/reception/PasswordReset.vue")
}
    , backstage]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
export default router