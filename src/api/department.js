import request from '@/utils/request'

export default {
  getAllDepartment() {
    return request({
      url: 'department/all',
      method: 'get',
    })
  },
}
