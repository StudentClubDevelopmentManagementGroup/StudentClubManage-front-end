import request from '@/utils/request'

export default {
    setManager(req) {
        return request({
            url: '/club/member/set_manager',
            method: 'post',
            data: req
        })
    },
    isClubMember(req) {
        return request({
            url: '/club/member/select_member',
            method: 'post',
            data: req
        })
    },
    getAllMember(req) {
        return request({
            url: '/club/member/select_all',
            method: 'post',
            data: req
        })
    },
    revokeManager(req) {
        return request({
            url: '/club/member/unset_manager',
            method: 'post',
            data: req
        })
    },
    delMember(req) {
        return request({
            url: '/club/member/del',
            method: 'post',
            data: req
        })
    },
    addMember(req) {
        return request({
            url: '/club/member/add',
            method: 'post',
            data: req
        })
    },
}
