export default {
    path: "/group",
    component: () =>
        import("@/view/reception/Group.vue"),
    redirect: "/group/tasks",
    children: [
        {
            path: "tasks",
            component: () =>
                import("@/components/reception/group/GroupTasks.vue"),
        }, {
            path: "resource",
            component: () =>
                import("@/components/reception/group/GroupResource.vue"),
        },
        {
            path: "task",
            component: () =>
                import("@/components/reception/group/GroupTaskDetail.vue"),
        },

    ]
}
