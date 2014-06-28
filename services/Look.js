/**
 * Created by daisy on 14-6-15.
 */

var async = require('async');

var Look = require('../model/Look');
var TagLook = require('../model/tag/Look');
var UserPublish = require('../model/user/Publish');
var UserWant = require('../model/user/Want');
var UserLike = require('../model/user/Like');
var UserTip = require('../model/user/Tip');

var User = require('../model/User');
var redis = require('../common/redis');

module.exports = {
    firstPublish: function (look, callback) {
        async.parallel([
            function saveLook(callback) {
                look.save(callback);
            },
            function syncTags(callback) {
                TagLook.putNewLook(look.tags, look._id, callback);
            },
            function syncPublication(callback) {
                UserPublish.putNewLook(look.publisher, look._id, callback);
            },
            function syncWant(callback) {
                UserWant.putNewLook(look.publisher, look._id, callback);
            }
        ], function (err, results) {
            callback(err, look);
        });
    },
    republish: function (old, look, callback) {
        async.parallel({
            syncWant: function syncWant(callback) {
                if (look.publisher === old.publisher) {
                    return callback(null, null);
                }
                UserWant.putNewLook(look.publisher, look._id, callback);
            },
            tags: function filterTags(callback) {
                async.filter(look.tags, function (tag, callback) {
                    callback(old.tags.indexOf(tag) < 0);
                }, function (tags) {
                    callback(null, tags);
                })
            },
            favorites: function filterFavorite(callback) {
                async.map(old.favorites, function (favorite, callback) {
                    callback(null, favorite._id);
                }, function (err, favoriteIds) {
                    async.filter(look.favorites, function (favorite, callback) {
                        callback(favoriteIds.indexOf(favorite._id) < 0);
                    }, function (favorites) {
                        callback(null, favorites);
                    });
                });
            }
        }, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            var tags = results.tags;
            var favorites = results.favorites;
            if (tags.length === 0 && favorites.length === 0) {
                return callback(err, old);
            }
            if (tags.length > 0) {
                TagLook.putNewLook(tags, look._id, function (err) {

                });
            }
            Look.appendTagsAndFavorites(look._id, tags, favorites,
                function (err, num) {
                    old.tags = old.tags.concat(tags);
                    old.favorites = old.favorites.concat(favorites);
                    if (null !== err || num !== 1) {
                        old = null;
                    }
                    callback(err, old);
                }
            )
        })
    },
    publish: function (look, callback) {
        Look.findById(look._id, function (err, old) {

            if (null !== old) {
                return this.republish(old, look, callback);
            }
            return this.firstPublish(look, callback);
        });
    },
    getTrend: function (start, num, callback) {
        Look.getTrend(parseInt(start), parseInt(num), function (err, looks) {
            if (null !== err || looks.length <= 0) {
                return callback(err, looks);
            }
            async.waterfall([
                function makePublisherIds(callback) {
                    async.map(looks, function (look, callback) {
                        callback(null, look.publisher);
                    }, callback);
                },
                function makePublisherMap(publisherIds, callback) {
                    User.perfect(publisherIds, callback);
                },
                function perfectDetailAndfilterNull(publisherMap, callback) {
                    async.filter(looks, function (look, callback) {
                        look.publisher = publisherMap[look.publisher];
                        callback(look.publisher);
                    }, function (looks) {
                        callback(null, looks);
                    });
                }
            ], callback);
        });
    },
    getMyWants: function (uid, start, num, callback) {
        this.getMyLooks(uid, UserWant, start, num, callback);
    },
    getMyLikes: function (uid, start, num, callback) {
        this.getMyLooks(uid, UserLike, start, num, callback);
    },
    getMyTips: function (uid, start, num, callback) {
        this.getMyLooks(uid, start, num, callback);
    },
    getMyLooks: function (uid, UserLook, start, num, callback) {
        async.waterfall([
            function (callback) {
                UserLook.gets(uid, start, num, callback);
            },
            function (userLook, callback) {
                if (null === userLook) {
                    return callback(null, []);
                }
                Look.gets(userLook.looks, callback);
            }
        ], callback)
    }
};