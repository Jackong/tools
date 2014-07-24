/**
 * Created by daisy on 14-7-18.
 */
var async = require('async');

var logger = require('../common/logger');

var UserWant = require('../model/user/Want');
var Favorite = require('../model/Favorite');
var NotificationService = require('../services/Notification');

Favorite.onWant(NotificationService.onWant);

module.exports = {
    //userWant可能同步过
    want: function (lookId, aspect, uid, callback) {
        async.parallel(
            [
                function (callback) {
                    Favorite.want(lookId, aspect, uid, callback);
                },
                function (callback) {
                    UserWant.putNewLook(uid, lookId, callback);
                }
            ],
            callback
        );
    },
    sync: function (uid, lookId, aspect, callback) {
        async.waterfall([
            function sync(callback) {
                Favorite.sync(uid, lookId, aspect, callback);
            },
            function add2Want(favorite, num, callback) {
                if (num === 0) {
                    return callback('add new favorite fail');
                }
                UserWant.putNewLook(uid, lookId, callback);
            }
        ], callback);
    }
};
