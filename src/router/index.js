import { createRouter, createWebHistory } from 'vue-router'
import { mapGetters } from 'vuex'
import backstage from '@/router/backstage'
import group from '@/router/group'
import groups from '@/router/groups'
import store from '@/store/index'
import race from '@/router/race'
import isReleasePath from '@/router/release'
const routes = [{
    path: "/user-agreement",
    component: () => import("@/view/AutoRegister.vue")
}, {
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
        redirect: "posts",
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
            path: "/solution/:problemId(\\d+)/:solutionId(\\d+)",
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
        }, {
            path: "/posts",
            component: () =>
                import("@/view/reception/Moments.vue"),
        }, {
            path: "/post/:solutionId(\\d+)",
            component: () => import("@/view/reception/Solution.vue")
        },
            group, groups, race
        ]
    }],
},
{
    path: "/poster",
    component: () =>
        import("@/view/reception/Poster.vue")
},
{
    path: "/poster/:posterId(\\d+)",
    component: () =>
        import("@/view/reception/Poster.vue")
},
{
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
{
    path: "/notfound",
    name: "notfound404",
    component: () => import("@/view/NotFound.vue")
},
// 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
{
    path: '/:pathMatch(.*)*', name: 'NotFound', redirect: {
        name: "notfound404"
    }
}]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
//登录拦截
router.beforeEach((to, from, next) => {
    if (!store.getters["user/isLogin"] && isReleasePath(to.fullPath)) {
        return next()
    } else if (!store.getters["user/isLogin"]) {
        return next({ path: "/login" })
    } else {
        return next()
    }
})
export default router