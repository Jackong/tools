var async = require('async');

var logger = require('../common/logger');
var ACTION = require('../common/const').NOTIFICATION_ACTION;

var Look = require('../model/Look');
var Favorite = require('../model/Favorite');
var UserNotification = require('../model/user/Notification');

module.exports = {
	onWant: function(lookId, uid, callback) {
		Look.getOne(lookId, function(err, look) {
			if (err || !look) {
				return;
			}	
			UserNotification.add(uid, look.publisher, ACTION.WANT_MY_LOOK, lookId, callback);
		});
	},
    onLike: function (lookId, uid, callback) {
        Look.getOne(lookId, function(err, look) {
            if (err || !look) {
                return;
            }
            UserNotification.add(uid, look.publisher, ACTION.LIKE_MY_LOOK, lookId, callback);
        });
    },
    onTip: function (tip) {
        Favorite.getOne(tip.look, tip.favorite, function (err, favorite) {
            if (err || !favorite || favorite.wants.length == 0) {
                return;
            }
            async.each(favorite.wants, function (want, callback) {
                UserNotification.add(tip.author, want, ACTION.TIP_MY_WANT, tip.look, callback);
            },
            function (err) {
                if (err) {
                    logger.error('add notification for', ACTION.TIP_MY_WANT, tip);
                }
            });
        });
    },
    onComment: function (tip, commenter) {
        Notification.add(commenter, tip.author, ACTION.COMMENT_MY_TIP, tip.look, function (err, num) {
            if (err || !num) {
                logger.error('add notification for', ACTION.COMMENT_MY_TIP, {tip: tip, commenter: commenter});
            }
        })
    }
};


