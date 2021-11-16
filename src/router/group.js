export default {
    path: "/group/:groupId(\\d+)",
    component: () =>
        import("@/view/reception/Group.vue"),
    redirect: to => {
        return `/group/${to.params.groupId}/tasks`;
    },
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
        {
            path: "invite",
            component: () =>
                import("@/components/reception/group/GroupInvite.vue")
        },
        {
            path:"task/edit",
            component:()=>
            import("@/components/reception/group/GroupTaskAdd.vue")
            
        }

    ]
}
