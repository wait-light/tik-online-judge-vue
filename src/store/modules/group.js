import { getOne } from "@/js/common_data_operation";
const state = () => ({
    //是否可以创建群组
    createable: false
})
// getters
const getters = {}

// actions
const actions = {
    setCreateable(state, createable) {
        state.createable = createable
    }
}

// mutations
const mutations = {
    createableGet(context) {
        getOne('/power/createable').then(res => {
            context.commit("setCreateable", res.success)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}