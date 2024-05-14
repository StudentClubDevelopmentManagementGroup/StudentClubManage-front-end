import request from '@/utils/request'

export default {
    // 查询基地：全部-关键字
    getBaseList(params) {
        return request({
            url: '/club/select_all',
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
    // 基地设置负责人
    setManager(data) {
        return request({
            url: '/club/member/set_manager',
            method: 'post',
            data
        })
    },
    // 撤销教师负责人
    deleteManager(data) {
        return request({
            url: '/club/member/unset_manager',
            method: 'post',
            data
        })
    }
}


