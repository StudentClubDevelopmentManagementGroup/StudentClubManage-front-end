import request from '@/utils/request'

export default {
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
