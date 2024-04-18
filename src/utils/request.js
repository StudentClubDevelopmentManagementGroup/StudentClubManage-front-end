import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { message } from "@/utils/message";
import { useUserStore } from '@/store/user.js'
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
    if (parseInt(res.status_code / 100) === 2) {
      return res.data
    }
    else {
      const userStore = useUserStore()
      // 需要动态刷新token
      if (res.status_code === -2 || res.status_code === -3 || res.status_code === -4 || res.status_code === -5) {
        userStore.logout().then(() => {
          message('您的登录状态过期或者无效，请您重新登录！',
            {
              type: 'error',
              duration: 2500
            })
        })
      } else if (res.status_code === 401) {
        ElMessageBox.confirm('未登录，请先登录！', '提示', {
          confirmButtonText: '登录',
          showCancelButton: false,
          type: 'warning',
        }).then(() => {
          // 清除数据然后跳转至登录
          router.replace(`/login`)
        })
      } else if (res.status_code === 999) {

      } else {
        message(res.data || 'Error',
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
