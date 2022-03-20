export default {
    path: "/personCenter/:uid(\\d+)?",
    component: () =>
        import("@/view/reception/PersonCenter.vue"),
    redirect: { name: "account" },
    children: [
        {
            name: "account",
            path: "account",
            component: () =>
                import("@/components/reception/person_center/Account.vue"),
        }, {
            path: "solutions",
            component: () =>
                import("@/components/reception/person_center/SolutionList.vue")
        }, {
            path: "problemInfo",
            component: () =>
                import("@/components/reception/person_center/ProblemInfo.vue")
        }
    ]
}