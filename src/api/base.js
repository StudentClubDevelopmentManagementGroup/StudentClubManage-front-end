import request from '@/utils/request'

export default {
    // 查询基地：全部-关键字
    getBaseList(data) {
        return request({
            url: '/club/select_all',
            method: 'post',
            data
        })
    },
    // 查询基地基础信息
    getBaseInfo(params) {
        return request({
            url: '/club/select',
            method: 'get',
            params
        })
    },
    // 新增基地
    addBase(data) {
        return request({
            url: '/club/add',
            method: 'post',
            data
        })
    },
    // 逻辑删除基地
    deleteBase(data) {
        return request({
            url: '/club/del',
            method: 'post',
            data
        })
    },
    // 逻辑恢复基地
    undeleteBase(data) {
        return request({
            url: '/club/undelete',
            method: 'post',
            data
        })
    },
    // 基地停止招新
    deactivateBase(data) {
        return request({
            url: '/club/recruitment/close',
            method: 'post',
            data
        })
    },
    // 基地开放招新
    reuseBase(data) {
        return request({
            url: '/club/recruitment/open',
            method: 'post',
            data
        })
    },
}

