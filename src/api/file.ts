import request from '@/utils/request'

export default {
    /**
     * @deprecated 文件测试接口，生产环境不要使用
     */
    uploadFileLocal() {
        return request({
            url: '/upload_file_to_local_file_system',
            method: 'post',
        })
    },
    /**
     * @deprecated 文件测试接口，生产环境不要使用
     */
    uploadFileCloud() {
        return request({
            url: '/upload_file_to_cloud_storage',
            method: 'post',
        })
    },
    /**
     * @deprecated 文件测试接口，生产环境不要使用
     */
    getFlieUrl(file_id) {
        return request({
            url: '/get_file_url',
            method: 'get',
            params: { file_id }
        })
    },
    /**
     * @deprecated 文件测试接口，生产环境不要使用
     */
    getFlie(file_id) {
        return request({
            url: 'get_file',
            method: 'get',
            params: { file_id }
        })
    },
}