import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { message } from "@/utils/message";
import useStore from '@/store'
import router from '@/router'
import { GetToken } from '@/utils/auth'
import constants from "@/config";

const service = axios.create({
  baseURL: constants.baseUrl,
  timeout: 20000 // request timeout
})
// // 允许携带cookie
// service.defaults.withCredentials = true
// // 请求头信息
service.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// // 默认使用 application/json 形式
service.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = GetToken()
    if (token) {
      config.headers['guet-s-c-m-s-token'] = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 文件下载
    if (response.config.responseType === 'blob') {
      return response
    }
    const res = response.data
    if (res.status_code === 200 || res.status_code === 201) {
      return res.data
    }
    else {
      if (res.status_code === 401) {
        ElMessageBox.confirm(res.status_text, '提示', {
          confirmButtonText: '登录',
          showCancelButton: false,
          type: 'warning',
        }).then(() => {
          router.replace(`/login`)
        })
      } else if (res.status_code === 999) {

      } else {
        message(res.data || res.status_text || 'Error',
          {
            type: 'error',
            duration: 2500
          }
        )
      }
      return Promise.reject(res.data || "Error")
    }
  },
  error => {
    message(error.message,
      {
        type: 'error',
        duration: 5 * 1000
      }
    )
    return Promise.reject(error)
  }
)

export default service
