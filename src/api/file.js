import request from '@/utils/request'

export default {
    uploadFileLocal() {
        return request({
            url: '/upload_file_to_local_file_system',
            method: 'post',
        })
    },
    uploadFileCloud() {
        return request({
            url: '/upload_file_to_cloud_storage',
            method: 'post',
        })
    },
    getFlieUrl(file_id) {
        return request({
            url: '/get_file_url',
            method: 'get',
            params: { file_id }
        })
    },
    getFlie(file_id) {
        return request({
            url: 'get_file',
            method: 'get',
            params: { file_id }
        })
    },
}
