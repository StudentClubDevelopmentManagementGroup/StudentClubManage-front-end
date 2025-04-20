import request from '@/utils/request'

export default {
	  getData(clubId) {
	    return request({
	      url: '/ai/data',
	      method: 'post',
	      params: {
	        club_id: clubId
	      }
	    });
	  },
	  getAnalyse(clubId) {
	    return request({
	      url: '/ai/analyse',
	      method: 'post',
	      params: {
	        club_id: clubId
	      }
	    });
	  },
}