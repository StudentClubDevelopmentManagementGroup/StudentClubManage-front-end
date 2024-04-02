import request from '@/utils/request'

export default {
  login({ user_id, pwd }) {
    return request({
      url: '/user/login/password',
      method: 'post',
      params: { user_id, pwd }
    })
  },
  regist(req) {
    return request({
      url: '/user/register',
      method: 'post',
      data: req
    })
  },
  emailLogin() {
    return request({
      url: '/user/login/email',
      method: 'post'
    })
  },
  logout() {
    return request({
      url: '/user/logout',
      method: 'post'
    })
  },
  cancel({ user_id, pwd }) {
    return request({
      url: '/user/cancel_account',
      method: 'post',
      params: { user_id, pwd }
    })
  },
  userList(userListQueryDTO) {
    return request({
      url: '/admin/query/userList',
      method: 'post',
      data: userListQueryDTO
    })
  },
  collectList(userId) {
    return request({
      url: '/user/collect-list',
      method: 'get',
      params: { userId }
    })
  },
  changeRole(userRoleChangeDTO) {
    return request({
      url: '/admin/update/role',
      method: 'post',
      data: userRoleChangeDTO
    })
  },
  updateUserTel(userUpdateTelDTO) {
    return request({
      url: '/admin/update/user/tel',
      method: 'post',
      data: userUpdateTelDTO
    })
  },
  updateUserName(userUpdateNameDTO) {
    return request({
      url: '/admin/update/user/name',
      method: 'post',
      data: userUpdateNameDTO
    })
  },
  updateUserInfo(userUpdateDTO) {
    return request({
      url: '/user/update/userInfo',
      method: 'post',
      data: userUpdateDTO
    })
  }
}