import axios from 'axios';

// 基本配置URL
const baseURL = ""

const instance = axios.create({
    baseURL: baseURL,
    timeout: 5000, // 请求超时
});

// TODO: 添加请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     // 在发送请求之前做些什么，例如添加 token
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );

// TODO: 添加响应拦截器
// instance.interceptors.response.use(
//   (response) => {
//     // 对响应数据做点什么，例如处理错误码
//     if (response.data.code !== 200) {
//       // 处理错误码
//     }
//     return response;
//   },
//   (error) => {
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   }
// );

export default instance;
