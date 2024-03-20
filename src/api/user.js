import request from '@/utils/request'

export default {
  login(userLoginDTO) {
    return request({
      url: '/admin/login',
      method: 'post',
      data: userLoginDTO
    })
  },
  logout() {
    return request({
      url: '/user/logout',
      method: 'get'
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
