import { getData } from "@/js/common_data_operation";
const state = () => ({
    directory: [],
    interfaces: new Set()
})
// getters
const getters = {
    //获取用户某个路径的目录
    getDirectory: (state) => (prefix) => {
        return state.directory.filter(item => {
            return item.url.indexOf(prefix) != -1
        })
    },
    //获取指定前缀的目录地址，必须有内容可显示的
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
    },
    //获取指定接口是否可展示
    isShowableInterface: (state) => (perms) => {
        return state.interfaces.has("*") || state.interfaces.has(perms)
    }
}

// const isShowableInterface = (directory, url, method) => {
//     for (let index = 0; index < directory.length; index++) {
//         const element = directory[index];
//         if (element.url == url && element.method.indexOf(method) != -1) {
//             return true
//         }
//         if (element.children && element.children != 0) {
//             if (isShowableInterface(element.children, url, method)) {
//                 return true
//             }
//         }
//     }
//     return false
// }


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
            if (res.success) {
                context.commit("setDirectory", res.dto)
            }
        })
    },
    loadInterfaces: (context) => {
        getData("/auth/menu/interfaces").then(res => {
            if (res.success) {
                context.commit("setInterfaces", res.dto)
            }
        })
    }
}

// mutations
const mutations = {
    setDirectory(state, directory) {
        state.directory = directory;
    },
    setInterfaces(state, interfaces) {
        const interfacesSet = state.interfaces;
        interfacesSet.clear()
        interfaces.forEach(item => {
            interfacesSet.add(item)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}