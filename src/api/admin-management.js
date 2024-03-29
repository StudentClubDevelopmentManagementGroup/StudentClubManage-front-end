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
