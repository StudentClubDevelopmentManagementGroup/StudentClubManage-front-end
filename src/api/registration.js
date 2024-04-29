import request from '@/utils/request'

export default {
    // 查询社团成员指定时间段打卡记录
    getRegistrationList(data) {
        return request({
            url: '/attendance/record',
            method: 'post',
            data
        })
    },
    // 查询社团成员当天最新的签到记录
    getLatestCheckInRecord({ userId, clubId }) {
        return request({
            url: '/attendance/getLatestCheckInRecord',
            method: 'get',
            params: { userId, clubId }
        })
    },
    // 签到
    checkIn(data) {
        return request({
            url: '/attendance/checkIn',
            method: 'post',
            data
        })
    },
    // 签退
    checkOut(data) {
        return request({
            url: '/attendance/checkout',
            method: 'patch',
            data
        })
    }
}
