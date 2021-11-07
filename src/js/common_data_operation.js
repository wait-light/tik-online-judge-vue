import axios from "@/js/http.js"
import { ElMessage, ElMessageBox } from 'element-plus'
/*
请求地址 ， 请求类型，请求数据，是否开启消息提示
*/
export default async function commonajax(url, methods = "get", data, enableMessage = false) {
    if (!url) {
        throw "must be has url"
    }
    var request

    if (methods === "get") {
        let params = data
        request = axios({
            url: url,
            method: 'GET',
            params: params
        })
    } else if (methods === "post") {
        request = axios.post(url, data)
    } else if (methods === "delete") {
        let params = data
        request = axios.delete(url, params)
    } else if (methods === "put") {
        request = axios.put(url, data)
    }
    request = request.then((result) => {
        let data = result.data
        if (enableMessage) {
            if (data.success) {
                ElMessage({
                    message: data.msg,
                    type: 'success'
                })
            } else {
                ElMessage({
                    message: data.msg,
                    type: 'error'
                })
            }
        }
        return data
    }).catch((err) => {
        if (enableMessage) {
            ElMessage({
                message: err.message,
                type: 'error'
            })
            //开发模式显示错误
        }
        if (import.meta.env.MODE == "development") {
            console.log(err)
            if (!enableMessage) {
                ElMessage({
                    message: err.message,
                    type: 'error'
                })
            }
        }
    });
    return request
}
/*
请求地址 ， 请求类型，请求数据，是否开启消息提示
*/
export async function commonajaxDataNoProcess(url, methods = "get", data, enableMessage = false) {
    if (!url) {
        throw "must be has url"
    }
    var request

    if (methods === "get") {
        let params = data
        request = axios({
            url: url,
            method: 'GET',
            params: params
        })
    } else if (methods === "post") {
        request = axios.post(url, data)
    } else if (methods === "delete") {
        let params = data
        request = axios.delete(url, params)
    } else if (methods === "put") {
        request = axios.put(url, data)
    }
    request = request.then((result) => {
        let data = result.data
        if (enableMessage) {
            if (data.success) {
                ElMessage({
                    message: data.msg,
                    type: 'success'
                })
            } else {
                ElMessage({
                    message: data.msg,
                    type: 'error'
                })
            }
        }
        return result
    }).catch((err) => {
        if (enableMessage) {
            ElMessage({
                message: err.message,
                type: 'error'
            })
            //开发模式显示错误
        }
        if (import.meta.env.MODE == "development") {
            console.log(err)
            if (!enableMessage) {
                ElMessage({
                    message: err.message,
                    type: 'error'
                })
            }
        }
    });
    return request
}
export async function commonajaxWithData(url, methods = "get", data, enableMessage = false) {
    let outData
    await commonajax(url, methods, data, enableMessage).then(res => {
        outData = res
    })
    return outData
}
export async function putData(url, data, enableMessage = false) {
    return commonajax(url, "put", data, enableMessage)
}
export async function getData(url, data, enableMessage = false) {
    return commonajax(url, "get", data, enableMessage)
}
export async function deleteData(url, data, enableMessage = false) {
    return commonajax(url, "delete", data, enableMessage)
}
export async function postData(url, data, enableMessage = false) {
    return commonajax(url, "post", data, enableMessage)
}
//删除默认开启提示，以及删除确认
export async function deleteById(url, id, enableMessage = true, tip = true) {
    if (tip) {
        return ElMessageBox.confirm('将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                return commonajaxWithData(url + `/${id}`, "delete", null, enableMessage);
            })
            .catch(() => {
                return {
                    code: 500,
                    msg: "删除取消"
                }
            });
    } else {
        return commonajaxWithData(url + `/${id}`, "delete", null, enableMessage)
    }
}
export async function getList(url, page = 1, pageSize = 10, orderBy = "", enableMessage = false) {
    return commonajaxWithData(url, "get", {
        page, pageSize, orderBy
    }, enableMessage)
}
export async function getOne(url, enableMessage = false) {
    return commonajaxWithData(url, "get", null, enableMessage)
}
/**
 * 
 * @param {*} url 
 * @param {*} id 
 * @param {*} data 
 * @param {*} enableMessage 
 * @returns 
 */
export async function update(url, id, data, enableMessage = true) {

    return commonajaxWithData(url + `/${id}`, "put", data, enableMessage)
}
export async function save(url, data, enableMessage = true) {
    return commonajaxWithData(url, "post", data, enableMessage)
}

