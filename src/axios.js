import axios from 'axios'
import Element from "element-ui";
import router from "./router";

axios.defaults.baseURL = 'http://localhost:8881'
const request = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = sessionStorage.getItem('token');
    return config;
})


request.interceptors.response.use(
    response => {
        // console.log("request.interceptors->response ->" , response)
        let res = response.data
        if (res.code === 200) {
            return response
        } else {
            Element.Message.error(!res.msg ? '系统异常' : res.msg)
            return Promise.reject(response.data.msg)
        }
    },
    error => {
        // console.log("request.interceptors->response ->error")
        if (error.response.data) {
            error.massage = error.response.data.msg
        }
        if (error.response.status === 401) {
            router.push("/front/login").then(r => {})
        }
        Element.Message.error(error.message, {duration: 3000})
        return Promise.reject(error)
    }
)
export default request