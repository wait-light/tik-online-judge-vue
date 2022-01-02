import { getOne } from "@/js/common_data_operation";
const state = () => ({
    //是否可以创建群组
    createable: false
})
// getters
const getters = {}

// actions
const actions = {
    createableGet(context) {
        getOne('/auth/verified/power/createable').then(res => {
            context.commit("setCreateable", res.success)
        })
    }
}

// mutations
const mutations = {
    setCreateable(state, createable) {
        state.createable = createable
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}