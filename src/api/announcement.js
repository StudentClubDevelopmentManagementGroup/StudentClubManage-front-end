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
	getRecruitmentNotice(req) {
	    return request({
	        url: '/club/announcement/recruitment',
	        method: 'get',
	        params: { ...req }
	    })
	},
	getActivityNotice(req) {
	    return request({
	        url: '/club/announcement/activity',
	        method: 'get',
	        params: { ...req }
	    })
	},
    getNowNotice(clubId) {
        return request({
            url: '/club/announcement/latest',
            method: 'get',
            params: { clubId }
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
	addReport(formData) {
	    return request({
	      url: '/club/report/add',
	      method: 'post',
	      data: formData,
	      headers: {
	        'Content-Type': 'multipart/form-data'
	      }
	    });
	  },
	  getReports(clubId, pageNum = 1, pageSize = 10) {
	    return request({
	      url: '/club/report/list',
	      method: 'post',
	      data: {
	        club_id: clubId,
	        page_num: pageNum,
	        page_size: pageSize
	      }
	    });
	  },
	  getReportsBykeyword(clubId, pageNum = 1, pageSize = 10, keyword) {
	    return request({
	      url: '/club/report/search',
	      method: 'post',
	      data: {
	        club_id: clubId,
			keyword:keyword,
	        page_num: pageNum,
	        page_size: pageSize
	      }
	    });
	  },
	  getMemberReports(clubId, pageNum = 1, pageSize = 10) {
	    return request({
	      url: '/club/report/member/list',
	      method: 'post',
	      data: {
	        club_id: clubId,
	        page_num: pageNum,
	        page_size: pageSize
	      }
	    });
	  },
	  deleteReport(reportId,clubId) {
	    return request({
	      url: '/club/report/del',
	      method: 'post',
	      params: { report_id: reportId,club_id: clubId}
	    });
	  },
	  generateSummaryReport(req) {
	    return request({
	      url: '/club/report/summary',
	      method: 'post',
	      data: req
	    });
	}
}
