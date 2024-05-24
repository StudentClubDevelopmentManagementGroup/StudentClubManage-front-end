import request from '@/utils/request'

export default {
    // 查询社团成员指定时间段打卡记录
    getRegistrationList({ clubId, userName, userId, startTime, endTime, currentPage, pageSize }) {
        return request({
            url: '/attendance/record',
            method: 'post',
            data: { clubId, userName, userId, startTime, endTime, currentPage, pageSize }
        })
    },
    // 查询社团成员指定时间段打卡有效时长
    getDurationTime({ clubId, userName, userId, startTime, endTime }) {
        return request({
            url: '/attendance/durationTime',
            method: 'post',
            data: { clubId, userName, userId, startTime, endTime }
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
    checkIn({ clubId, userId, checkInTime }) {
        return request({
            url: '/attendance/checkIn',
            method: 'post',
            data: { clubId, userId, checkInTime }
        })
    },
    // 签退
    checkOut({ clubId, userId, checkInTime, checkoutTime }) {
        return request({
            url: '/attendance/checkout',
            method: 'patch',
            data: { clubId, userId, checkInTime, checkoutTime }
        })
    },
    // 补签 
    replenish({ clubId, userId, checkInTime, checkoutTime }) {
        return request({
            url: '/attendance/replenish',
            method: "post",
            data: { clubId, userId, checkInTime, checkoutTime }
        })
    }
}
