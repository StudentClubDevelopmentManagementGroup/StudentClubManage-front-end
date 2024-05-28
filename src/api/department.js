import request from '@/utils/request'

export default {
  // 获取院系信息
  getAllDepartment() {
    return request({
      url: 'department/all',
      method: 'get',
    })
  },
  // 添加新院系
  addDepartment(data) {
    return request({
      url: '/department/add',
      method: 'post',
      data
    })
  },
  // 删除院系
  deleteDepartment(data) {
    return request({
      url: `/department/${data}`,
      method: 'delete'
    })
  },
  // 修改院系信息
  updateDepartment(data) {
    return request({
      url: '/department/update',
      method: 'put',
      data
    })
  }
}
