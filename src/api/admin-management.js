import request from '@/utils/request'
// 查询基地：全部-关键字
export function getBaseList(params) {
    return request({
        url: '/manage_all/select_all',
        method: 'get',
        params
    })
}
export function queryBase(data) {
    return request({
        url: '/manage_all/select_club',
        method: 'post',
        data
    })
}
// 新增基地
export function addBase(data) {
    return request({
        url: '/manage_all/create_club',
        method: 'post',
        data
    })
}
// 逻辑删除基地
export function deleteBase(data) {
    return request({
        url: '/manage_all/delete_club',
        method: 'post',
        data
    })
}
// 逻辑恢复基地
export function recoverBase(data) {
    return request({
        url: '/manage_all/recover_club',
        method: 'post',
        data
    })
}
// 基地停止招新
export function deactivateBase(data) {
    return request({
        url: '/manage_all/deactivate_club',
        method: 'post',
        data
    })
}
// 基地开放招新
export function reuseBase(data) {
    return request({
        url: '/manage_all/reuse_club',
        method: 'post',
        data
    })
}
// 变更教师负责人
export function setTeacherManager(data) {
    return request({
        url: '/manage_all/select_manager',
        method: 'post',
        data
    })
}
// 获取院系列表数据
export function getDepartmentList() {
    return request({
        url: '/department/all',
        method: 'get',
    })
}
// 添加新院系
export function addDepartment(data) {
    return request({
        url: '/department/add',
        method: 'post',
        data
    })
}
// 删除院系
export function deleteDepartment(data) {
    return request({
        url: `/department/${data}`,
        method: 'delete'
    })
}
// 修改院系信息
export function modifyDepartment(data) {
    return request({
        url: '/department/update',
        method: 'put',
        data
    })
}