/**
 * Created by daisy on 14-7-6.
 */
var async = require('async');

var logger = require('../common/logger');
var helper = require('../common/helper');
var UserTip = require('../model/user/Tip');
var Tip = require('../model/Tip');
var Favorite = require('../model/Favorite');
var redis = require('../common/redis');

module.exports = {
    getsByIds: function (lookId, favoriteId, tids, callback) {
        Tip.gets(tids, callback);
    },
    addTip: function (lookId, favoriteId, tip, callback) {
        tip.save(function (err, doc) {
            if (err) {
                return callback(err, null);
            }
            async.parallel({
                userTip: function (callback) {
                    UserTip.putNewLook(tip.author, lookId, callback);
                },
                favorite: function (callback) {
                    Favorite.putNewTip(lookId, favoriteId, doc._id, callback);
                }
            }, function (err, result) {
                if (err) {
                    return callback(err, null);
                }
                callback(err, doc.toObject());
            })
        })
    }
};