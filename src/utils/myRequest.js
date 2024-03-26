import axios from 'axios';

// 基本配置URL
const baseURL = "http://localhost:3333/"

const instance = axios.create({
    baseURL: baseURL,
    timeout: 40000, // 请求超时
});

// 允许携带cookie
instance.defaults.withCredentials = true
// 请求头信息
instance.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// 默认使用 application/json 形式
instance.defaults.headers.post['Content-Type'] = 'application/json'

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 文件下载
        if (response.config.responseType === 'blob') {
            return response
        }

        const res = response.data
        if (res.status_code !== 200 && res.status_code !== 404) {
            const userStore = useUserStore()
            // 需要动态刷新token
            if (res.code === -2 || res.code === -3 || res.code === -4 || res.code === -5) {
                userStore.Logout().then(() => {
                    ElMessage({
                        message: '您的登录状态过期或者无效，请您重新登录！',
                        type: 'error',
                        duration: 2500
                    })
                })
            } else if (res.code === -1) {
                ElMessageBox.confirm('未登录，请先登录！', '提示', {
                    confirmButtonText: '登录',
                    showCancelButton: false,
                    type: 'warning',
                }).then(() => {
                    // 清除数据然后跳转至登录
                    router.replace(`/login`)
                })
            } else if (res.code === 999) {

            } else {
                ElMessage({
                    message: res.message || 'Error',
                    type: 'error',
                    duration: 2500
                })
            }
            return Promise.reject(res.message || "Error")
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' + error)
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default instance;
