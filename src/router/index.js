import { createRouter, createWebHistory } from 'vue-router'
import backstage from '@/router/backstage'
import group from '@/router/group'
import groups from '@/router/groups'
const routes = [{
    path:"/user-agreement",
    component:()=>import("@/view/AutoRegister.vue")
},{
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
            path: "problemlist/:id(\\d+)",
            component: () =>
                import("@/view/reception/TikProblems.vue")
        },
        {
            path: "/problem/:id(\\d+)",
            component: () =>
                import("@/view/reception/TikProblemDetail.vue")
        }, {
            path: "/problem-collection",
            component: () =>
                import("@/view/reception/TikProblemCollections.vue")
        }, {
            path: "/problemDetail/:collectionid(\\d+)",
            component: () =>
                import("@/view/reception/AddProblemDetail.vue")
        }, {
            path: "/problemDetail/update/:problemid(\\d+)",
            component: () =>
                import("@/view/reception/AddProblemDetail.vue")
        },
        {
            path: "/addSolution/:problemId(\\d+)",
            component: () =>
                import("@/view/reception/AddSolution.vue")
        }, {
            path: "/solution/:solutionId(\\d+)",
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
    , backstage,
// 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
{ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import("@/view/NotFound.vue") }]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
export default router