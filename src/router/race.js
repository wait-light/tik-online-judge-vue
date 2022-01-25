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
        }
    ]
}