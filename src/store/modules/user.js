import { getOne } from "@/js/common_data_operation";
var token = localStorage.getItem("token");
const state = () => ({
    user: {
        login: token != undefined,
        token,
    }
})
// getters
const getters = {
    isLogin: state => {
        return state.user.login
    }
}

// actions
const actions = {
    loginMessage(context) {
        getOne("/auth/verified/title-info").then(res => {
            if (res.success) {
                context.commit("updateDetail", res.user)
            }
        })
    }
}

// mutations
const mutations = {
    updateDetail(state, detail) {
        state.user = Object.assign(state.user, detail);
    },
    login(state, token) {
        state.user.token = token
        state.user.login = true
        localStorage.setItem("token", token);
    },
    logout(state) {
        state.user.token = null
        state.user.login = false
        localStorage.removeItem("token");
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}