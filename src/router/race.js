export default {
    path: "/race/:raceId(\\d+)",
    component: () =>
        import("@/view/reception/RaceTask.vue"),
    redirect: {
        name: "survey"
    },
    children: [
        {
            name: "survey",
            path: "survey",
            component: () => import("@/components/reception/race/Survey.vue")
        },
        {
            path: "problems",
            component: () => import("@/components/reception/race/ProblemList.vue")
        },
        {
            path: "submission",
            component: () => import("@/components/reception/race/Submission.vue")
        },
        {
            path: "rank",
            component: () => import("@/components/reception/race/Rank.vue")
        },
        {
            path: "problem/:problemId(\\d+)",
            component: () => import("@/components/reception/race/Problem.vue")
        }
    ]
}