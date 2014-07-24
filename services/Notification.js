var async = require('async');

var logger = require('../common/logger');
var ACTION = require('../common/const').NOTIFICATION_ACTION;

var Tip = require('../model/Tip');
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
                    logger.error('add notification for', ACTION.TIP_MY_WANT, {err: err, tip: tip});
                }
            });
        });
    },
    onComment: function (tip, commenter) {
        Notification.add(commenter, tip.author, ACTION.COMMENT_MY_TIP, tip.look, function (err, num) {
            if (err || 1 !== num) {
                logger.error('add notification for', ACTION.COMMENT_MY_TIP, {err: err, tip: tip, commenter: commenter});
            }
        })
    },
    onLikeTip: function (tid, lookId, aspect, uid) {
        Tip.getOne(tid, lookId, aspect, function (err, tip) {
            Notification.add(uid, tip.author, ACTION.LIKE_MY_TIP, lookId, function (err, num) {
                if (err || 1 !== num) {
                    logger.error('add notification for', ACTION.LIKE_MY_TIP, {err: err, tip: tip, num: num});
                }
            });
        });
    }
};


