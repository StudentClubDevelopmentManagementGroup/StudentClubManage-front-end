import request from '@/utils/request'

export default {
    noticeToDraft(announcementId) {
        return request({
            url: '/club/announcement/to_draft',
            method: 'post',
            params: { announcementId }
        })
    },
    addNotice(req) {
        return request({
            url: '/club/announcement/publish',
            method: 'post',
            data: req
        })
    },
    delNotice(announcementId) {
        return request({
            url: '/club/announcement/del',
            method: 'post',
            params: { announcementId }
        })
    },
    getAllNotice(req) {
        return request({
            url: '/club/announcement/search',
            method: 'get',
            params: { ...req }
        })
    },
    getNoticeContent(announcementId) {
        return request({
            url: '/club/announcement/read',
            method: 'get',
            params: { announcementId }
        })
    },
    addDraft(req) {
        return request({
            url: '/club/announcement/draft/save',
            method: 'post',
            data: req
        })
    },
    delDraft(draftId) {
        return request({
            url: '/club/announcement/draft/del',
            method: 'post',
            params: { draftId }
        })
    },
    delAllDraft(club_id) {
        return request({
            url: '/club/announcement/draft/clear',
            method: 'post',
            params: { club_id }
        })
    },
    getAllDraft(club_id, page_num, page_size) {
        return request({
            url: '/club/announcement/draft/list',
            method: 'get',
            params: { club_id, page_num, page_size }
        })
    },
    getDraftContent(draftId) {
        return request({
            url: '/club/announcement/draft/read',
            method: 'get',
            params: { draftId }
        })
    },
}
