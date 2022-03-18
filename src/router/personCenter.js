export default {
    path: "/personCenter/:uid(\\d+)?",
    component: () =>
        import("@/view/reception/PersonCenter.vue"),
    redirect: "/personCenter/account",
    children: [
        {
            path: "account",
            component: () =>
                import("@/components/reception/person_center/Account.vue"),
        }, {
            path: "solutions",
            component: () =>
                import("@/components/reception/person_center/SolutionList.vue")
        }
    ]
}