/**
 * Created by daisy on 14-6-15.
 */

var async = require('async');

var Look = require('../model/Look');
var Favorite = require('../model/Favorite');
var TagLook = require('../model/tag/Look');
var UserPublication = require('../model/user/Publication');
var UserWant = require('../model/user/Want');
var UserFeed = require('../model/user/Feed');
var User = require('../model/User');

exports.getFeeds = function (uid, skip, limit, cb) {
    async.waterfall([
        function findFeeds(callback) {
            UserFeed.findById(
                {
                    _id: uid,
                    feeds: {
                        $slice: [skip, limit]
                    }
                },
                {
                    feeds: 1
                },
                callback
            );
        },
        function attachLooks(feed, callback) {
            if (null === feed) {
                callback('feed not found', null);
                return;
            }
            Look.find(
                {
                    _id: {
                        $in: feed.feeds
                    },
                    isValid: true
                },
                {
                    isValid: 0,
                    updated: 0,
                    likes: 0
                },
                {
                    lean: true
                },
                callback
            );
        },
        function findPublishersAndFavorites(looks, callback) {
            var uids = [];
            var favoriteIds = [];
            async.each(looks, function (look, callback) {
                uids.push(look.publisher);
                favoriteIds = favoriteIds.concat(look.favorites);
                callback();
            }, function (err) {
                async.parallel({
                    users: function (callback) {
                        User.find(
                            {
                                _id: {
                                    $in: uids
                                },
                                isValid: true
                            },
                            {
                                nick: 1,
                                avatar: 1
                            },
                            callback
                        )
                    },
                    favorites: function (callback) {
                        Favorite.find(
                            {
                                _id: {
                                    $in: favoriteIds
                                },
                                isValid: true
                            },
                            {
                                wantCount: 1,
                                tipCount: 1
                            },
                            callback
                        )
                    }
                }, function (err, results) {
                    callback(err, looks, results.users, results.favorites);
                });
            });
        },
        function makeUserMapAndFavoriteMap(looks, users, favorites, callback) {
            async.parallel({
                userMap: function (callback) {
                    var userMap = [];
                    async.each(users, function (user, callback) {
                        userMap[user._id] = user;
                        callback();
                    }, function (err) {
                        callback(err, userMap);
                    });
                },
                favoriteMap: function (callback) {
                    var favoriteMap = [];
                    async.each(favorites, function (favorite, callback) {
                        favoriteMap[favorite._id] = favorite;
                        callback();
                    }, function (err) {
                        callback(err, favoriteMap);
                    });
                }
            }, function (err, results) {
                callback(err, looks, results.userMap, results.favoriteMap);
            });

        },
        function attachPublisherAndFavorite(looks, userMap, favoriteMap, callback) {
            async.filter(looks, function (look, callback) {
                var user = userMap[look.publisher];
                if (typeof user === 'undefined') {
                    return callback(false);
                }
                look.publisher = user;
                async.map(look.favorites, function (favorite, callback) {
                    callback(null, favoriteMap[favorite]);
                }, function (err, favorites) {
                    look.favorites = favorites;
                });
                callback(true);
            }, function (looks) {
                callback(null, looks);
            });
        }
    ],cb);
};