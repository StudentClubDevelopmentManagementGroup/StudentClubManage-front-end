import request from '@/utils/request'

export default {
	  getAnalyse(clubId) {
	    return request({
	      url: '/ai/chat',
	      method: 'post',
	      params: {
	        club_id: clubId
	      }
	    });
	  },
}