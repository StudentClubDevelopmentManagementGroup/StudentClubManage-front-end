import request from '@/utils/request'

export default {
	  getReports(clubId) {
	    return request({
	      url: '/ai/chat',
	      method: 'post',
	      data: {
	        club_id: clubId,
	      }
	    });
	  },
}