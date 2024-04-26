import request from '@/utils/request'

export default {
    // 社团成员签到
    addCheckIn(data) {
        return request({
            url: '/clockIn/checkIn',
            method: 'post',
            data
        })
    },
    // 查询社团成员指定时间段打卡记录
    getRegistrationList(data) {
        return request({
            url: '/clockIn/attendance/record',
            method: 'post',
            data
        })
    }
}
