import request from "@/utils/request"

export default {
    // 查询指定用户账号信息
    getOneselfUserInfo({ user_id }) {
        return request({
            url: "/user/management/select",
            method: "get",
            params: user_id
        })
    },
    // 查询所用用户账号信息
    getAllUserInfo({ page_num, page_size }) {
        return request({
            url: "/user/management/select/all",
            method: "get",
            params: { page_num, page_size }
        })
    },
    // 搜索用户，返回账号信息
    getUserList({ user_id, user_name, department_id, page_num, page_size }) {
        return request({
            url: "/user/management/search",
            method: "get",
            params: { user_id, user_name, department_id, page_num, page_size }
        })
    },
    // 超级管理员强制修改密码
    updatePwd({ user_id, pwd }) {
        return request({
            url: "/user/management/set/password",
            method: "post",
            data: { user_id, pwd }
        })
    },

}