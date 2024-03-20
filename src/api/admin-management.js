import request from '@/utils/request'

export function getBaseList(params) {
    return request({
        url: '/api/test',
        method: 'get',
        params
    })
}