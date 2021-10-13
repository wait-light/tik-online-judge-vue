import axios from "axios";
// axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    let item = localStorage.getItem("token")
    //已登录用户同时发送token
    if (item) {
        config.headers["token"] = item
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
export default axios;