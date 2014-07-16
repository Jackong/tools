/**
 * Created by daisy on 14-7-6.
 */
var async = require('async');

var logger = require('../common/logger');
var helper = require('../common/helper');
var UserTip = require('../model/user/Tip');
var Tip = require('../model/Tip');
var Favorite = require('../model/Favorite');

module.exports = {
    getsByIds: function (lookId, favoriteId, tids, callback) {
        Tip.gets(tids, lookId, favoriteId, callback);
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
    addComment: function (commenter, tipId, lookId, favoriteId, content, callback) {
        Tip.comment(tipId, lookId, favoriteId, commenter, content, callback);
    }
};