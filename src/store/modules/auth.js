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
    },
    firstLinkfulDirectoryUrl: (state) => (prefix) => {
        let queue = [...state.directory]
        while (queue.length > 0) {
            let item = queue.splice(0, 1)[0]
            if (item.children && item.children.length > 0) {
                queue.push(...item.children)
            }
            if (item.url && item.url.indexOf(prefix) != -1 && getQueryVariable(item.url, "link") !== 'false') {
                return item.url;
            }
        }
        return prefix;
    }
}


const getQueryVariable = (url, variable) => {
    let index = url.indexOf("?")
    if (index == -1) {
        return false
    }
    var query = url.substring(index + 1, url.length)
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

// actions
const actions = {
    loadDectory: (context) => {
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