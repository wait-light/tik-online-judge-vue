export default {
    path: "/groups",
    component: () =>
        import("@/view/reception/Groups.vue"),
    redirect: "/groups/list",
    children: [
        {
            path: "list",
            component: () =>
                import("@/components/reception/group/MyGroups.vue"),
        },{
            path:"invite-info",
            component:()=>  import("@/components/reception/group/GroupInviteInfo.vue"),
        }
    ]
}