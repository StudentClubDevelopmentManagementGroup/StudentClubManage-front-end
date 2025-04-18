import request from '@/utils/request'

export default {
    getAllDuty(req) {
        return request({
            url: '/club/duty/select',
            method: 'post',
            data: req
        })
    },
    getSelfDuty(req) {
        return request({
            url: '/club/duty/selectself',
            method: 'post',
            data: req
        })
    },
    addDutyReport(req) {
        return request({
            url: '/club/duty/report_results',
            method: 'post',
            data: req
        })
    },
    getAllGroup(req) {
        return request({
            url: '/club/duty/group/select',
            method: 'post',
            data: req
        })
    },

    addMember(req) {
        return request({
            url: '/club/duty/group/add',
            method: 'post',
            data: req
        })
    },
    delMember(req) {
        return request({
            url: '/club/duty/group/delete',
            method: 'post',
            data: req
        })
    },
    delGroupDuty(req) {
        return request({
            url: '/club/duty/delete_by_group',
            method: 'post',
            data: req
        })
    },
    delDuty(req) {
        return request({
            url: '/club/duty/delete',
            method: 'post',
            data: req
        })
    },
    addGroupDuty(req) {
        return request({
            url: '/club/duty/create_by_group',
            method: 'post',
            data: req
        })
    },
    addMemberDuty(req) {
        return request({
            url: '/club/duty/create',
            method: 'post',
            data: req
        })
    },
    getAutoDuty(clubId) {
        return request({
            url: '/club/duty/auto_duty',
            method: 'post',
            params: { clubId }
        })
    },
    setAutoDuty(req) {
        return request({
            url: '/club/duty/auto_duty/set',
            method: 'post',
            data: req
        })
    },
}
