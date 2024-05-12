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
    // 查询社团成员指定时间段打卡有效时长
    getDurationTime({ clubName, userName, userId, startTime, endTime }) {
        return request({
            url: '/attendance/durationTime',
            method: 'post',
            data: { clubName, userName, userId, startTime, endTime }
        })
    },
    // 查询社团成员当天最新的签到记录
    getLatestCheckInRecord({ userId, clubName }) {
        return request({
            url: '/attendance/getLatestCheckInRecord',
            method: 'get',
            params: { userId, clubName }
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
    },
    // 补签 
    replenish(data) {
        console.log("data", data)
        return request({
            url: '/attendance/replenish',
            method: "post",
            data
        })
    }
}
