var async = require('async');

var logger = require('../common/logger');
var ACTION = require('../common/const').NOTIFICATION_ACTION;

var Look = require('../model/Look');
var UserNotification = require('../model/user/Notification');

module.exports = {
	onWant: function(lookId, uid, callback) {
		Look.getOne(lookId, function(err, look) {
			if (err || !look) {
				return;
			}	
			UserNotification.add(uid, look.publisher, ACTION.WANT_MY_LOOK, lookId, callback);
		});	
	}
};


