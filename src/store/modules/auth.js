import { getData } from "@/js/common_data_operation";
const state = () => ({
    directory: [],
})
// getters
const getters = {
    getDirectory: (state) => (prefix) => {
        return state.directory.filter(item => {
            return item.url.indexOf(prefix) != -1
        })
    }
}

// actions
const actions = {
    loadDectory:(context)=> {
        getData("/auth/menu/directory").then(res => {
            context.commit("setDirectory", res.dto)
        })
    },
}

// mutations
const mutations = {
    setDirectory(state, directory) {
        state.directory = directory;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}