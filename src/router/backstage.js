
export default {
    path: "/backstage",
    component: () =>
        import("@/view/backstage/TikBackstage.vue"),
    children: [{
        path: "role",
        component: () =>
            import("@/components/backstage/role/RoleList.vue")
    }, {
        path: "menu",
        component: () =>
            import("@/components/backstage/menu/MenuList.vue")
    }, {
        path: "user",
        component: () =>
            import("@/components/backstage/user/UserList.vue")
    },
    {
        path: "ask",
        component: () => import("@/components/backstage/menu/Ask.vue")
    },
    {
        path: "problem",
        component: () =>
            import("@/components/backstage/problem/ProblemList.vue")
    },
    // {
    //     path: "problemdata",
    //     component: () =>
    //         import("@/components/backstage/problemdata/ProblemDataList.vue")
    // },
    {
        path: "submit",
        component: () =>
            import("@/components/backstage/submit/SubmitList.vue")
    },
    // {
    //     path: "tag",
    //     component: () =>
    //         import("@/components/backstage/tag/TagList.vue")
    // },
    {
        path: "problemcollection",
        component: () =>
            import("@/components/backstage/problemcollection/ProblemCollectionList.vue")
    }
        // ,
        // {
        //     path: "problemcollectionitem",
        //     component: () =>
        //         import("@/components/backstage/problemcollectionitem/ProblemCollectionItemList.vue")
        // }
    ]

}