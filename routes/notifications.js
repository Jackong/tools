
var logger = require('../common/logger');
require('../common/mongo');
var Notification = require('../model/user/Notification');
var UserService = require('../services/User');

module.exports = function users(router) {
    router.get('/notifications', 
	router.checker.query('page', 'num'),	
	function getNotificationsByPaging(req, res) {
		var uid = UserService.getUid(req, res);
		Notification.gets(uid, req.query.page * req.query.num, req.query.num, function(err, notification) {
			var notifications = [];
			if (err) {
				logger.error('notifications not found', uid, err);
			} else {
				notifications = notification.notifications;
			}

			res.ok({notifications: notifications});
		});
    	}
    );
}; 
