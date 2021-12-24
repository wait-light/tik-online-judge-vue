export default {
    path: "/group/:groupId(\\d+)",
    component: () =>
        import("@/view/reception/Group.vue"),
    // redirect: to => {
    //     return `/group/${to.params.groupId}/tasks`;
    // },
    children: [
        {
            path: "problem",
            component: () =>
                import("@/components/reception/group/GroupProblemAdd.vue")
        }, {
            path: "problem/:problemId(\\d+)",
            component: () =>
                import("@/components/reception/group/GroupProblemAdd.vue")
        }, {
            path: "user-manager",
            component: () =>
                import("@/components/reception/group/UserManager.vue")
        }, {
            path: "tasks",
            component: () =>
                import("@/components/reception/group/GroupTasks.vue"),
        },
        {
            path: "resource",
            component: () =>
                import("@/components/reception/group/GroupResource.vue"),
        },
        {
            path: "task/:taskId(\\d+)",
            component: () =>
                import("@/components/reception/group/GroupTaskDetail.vue"),
        },
        {
            path: "invite",
            component: () =>
                import("@/components/reception/group/GroupInvite.vue")
        },
        {
            path: "task/manager",
            component: () =>
                import("@/components/reception/group/GroupTaskManager.vue")

        },
        {
            path: "task",
            component: () =>
                import("@/components/reception/group/GroupTaskAdd.vue"),
        },
        {
            path: "task/:taskId(\\d+)/manager",
            component: () =>
                import("@/components/reception/group/GroupTaskUserInfo.vue"),
        },
        {
            path: "problems",
            component: () =>
                import("@/components/reception/group/GroupProblem.vue")
        }

    ]
}
