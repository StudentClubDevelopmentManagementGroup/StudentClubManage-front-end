import myRequest from '@/utils/myRequest'

export function getBaseList(params) {
    return myRequest({
        url: '/api/test',
        method: 'get',
        params
    })
}