/**
 * Created by daisy on 14-7-6.
 */
var async = require('async');

var logger = require('../common/logger');
var helper = require('../common/helper');
var UserTip = require('../model/user/Tip');
var Tip = require('../model/Tip');
var Favorite = require('../model/Favorite');
var NotificationService = require('../services/Notification');

Tip.onTip(NotificationService.onTip);
Tip.onComment(NotificationService.onComment);

module.exports = {
    getsByIds: function (lookId, aspect, tids, callback) {
        Tip.gets(tids, lookId, aspect, callback);
    },
    addTip: function (tip, callback) {
        tip.save(function (err, doc) {
            if (err) {
                return callback(err, null);
            }
            async.parallel({
                userTip: function (callback) {
                    UserTip.putNewLook(tip.author, tip.look, callback);
                },
                favorite: function (callback) {
                    Favorite.putNewTip(tip.look, tip.favorite, doc._id, callback);
                }
            }, function (err, result) {
                if (err) {
                    return callback(err, null);
                }
                callback(err, doc.toObject());
            })
        })
    },
    addComment: function (commenter, tipId, lookId, aspect, content, callback) {
        Tip.comment(tipId, lookId, aspect, commenter, content, callback);
    },
    addLike: function (uid, lookId, aspect, tipId, callback) {
        Tip.like(tipId, lookId, aspect, uid, callback);
    }
};