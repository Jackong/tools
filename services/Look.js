/**
 * Created by daisy on 14-6-15.
 */

var async = require('async');

var Look = require('../model/Look');
var TagLook = require('../model/tag/Look');
var UserPublication = require('../model/user/Publication');
var UserWant = require('../model/user/Want');
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
                UserPublication.putNewLook(look.publisher, look._id, callback);
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

    },
    calTrend: function () {

    }
};