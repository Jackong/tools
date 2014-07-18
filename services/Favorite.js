/**
 * Created by daisy on 14-7-18.
 */
var async = require('async');

var logger = require('../common/logger');

var UserWant = require('../model/user/Want');
var Favorite = require('../model/Favorite');

module.exports = {
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
    }
};