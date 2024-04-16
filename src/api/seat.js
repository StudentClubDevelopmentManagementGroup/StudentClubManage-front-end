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
    setSeatOwner(req) {
        return request({
            url: '/club/seat/set_owner',
            method: 'post',
            data: req
        })
    },
    updateSeatInfo(userUpdateDTO) {
        return request({
            url: '/club/seat/update_info',
            method: 'post',
            data: userUpdateDTO
        })
    },
    getMemberNoSeat(club_id) {
        return request({
            url: '/club/seat/members/no_seat',
            method: 'get',
            params: { club_id }
        })
    }
}
