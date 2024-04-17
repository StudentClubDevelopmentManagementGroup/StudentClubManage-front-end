import request from '@/utils/request'

export default {
    getAllSeat(club_id) {
        return request({
            url: '/club/seat/view',
            method: 'get',
            params: { club_id }
        })
    },
    addSeat(req) {
        return request({
            url: '/club/seat/add',
            method: 'post',
            data: req
        })
    },
    delSeat(req) {
        return request({
            url: '/club/seat/del',
            method: 'post',
            data: req
        })
    },
    updateSeatInfo(req) {
        return request({
            url: '/club/seat/update',
            method: 'post',
            data: req
        })
    },
    getMemberNoSeat(club_id, page_num, page_size) {
        return request({
            url: '/club/seat/members/no_seat',
            method: 'get',
            params: { club_id, page_num, page_size }
        })
    }
}
