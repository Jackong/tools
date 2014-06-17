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

var republish = exports.republish = function (old, look, callback) {
    async.parallel([
        function syncTagsFeed(callback) {
            async.filter(look.tags, function (tag, callback) {
                if (old.tags.indexOf(tag) > -1) {
                    return callback(false);
                }
                callback(true);
            }, function (tags) {
                look.tags = tags;
                UserFeed.update4tags(tags, look._id);
                callback();
            });
        },
        function syncFollowerFeed(callback) {
            if (look.publisher !== old.publisher) {
                UserFeed.update4user(look.publisher, look._id);
            }
            callback();
        },
        function syncWant(callback) {
            if (look.publisher !== old.publisher) {
                UserWant.sync(look.publisher, look._id);
            }
            callback();
        },
        function filterFavorite(callback) {
            for(var idx = 0; idx < old.favorites.length; idx++) {
                var favorite = old.favorites[idx];
                if (favorite._id == look.favorites[0]._id) {
                    look.favorites.pop();
                    break;
                }
            }
            callback();
        }
    ], function (err, results) {
        if (typeof err !== 'undefined') {
            return callback(err, null);
        }
        if (look.tags.length === 0 && look.favorites.length === 0) {
            return callback(err, old);
        }
        Look.update(
            {
                _id: look._id
            },
            {
                $addToSet: {
                    tags: {
                        $each: look.tags
                    },
                    favorites: {
                        $each: look.favorites
                    }
                }
            },
            {
                upsert: true
            },
            function (err, num) {
                old.tags = old.tags.concat(look.tags);
                old.favorites = old.favorites.concat(look.favorites);
                if (null !== err || num !== 1) {
                    old = null;
                }
                callback(err, old);
            }
        )
    })
};

var publish = exports.publish = function (lookId, publisher, image, tags, aspect, description, callback) {
    Look.findById(lookId, function (err, old) {
        var look = new Look(
            {
                _id: lookId,
                publisher: publisher,
                image: image,
                tags: tags,
                description: description,
                favorites: [
                    {
                        aspect: aspect,
                        wants: [publisher],
                        wantCount: 1
                    }
                ]
            }
        );
        if (null !== old) {
            return republish(old, look, callback);
        }

        async.parallel([
            function saveLook(callback) {
                look.save(callback);
            },
            function syncTags(callback) {
                async.each(tags, function (tag, callback) {
                    TagLook.update(
                        {
                            _id: tag
                        },
                        {
                            $addToSet:
                            {
                                looks: lookId
                            },
                            $inc: {
                                lookCount: 1
                            }
                        },
                        {
                            upsert: true
                        }
                    ).exec();
                    callback();
                }, function (err) {
                    callback(err);
                });

            },
            function syncPublication(callback) {
                UserPublication.update(
                    {
                        _id: publisher
                    },
                    {
                        $addToSet:
                        {
                            publications: lookId
                        }
                    },
                    {
                        upsert: true
                    }
                ).exec();
                callback();
            },
            function syncWant(callback) {
                UserWant.sync(publisher, lookId);
                callback();
            },
            function syncFeed(callback) {
                UserFeed.update4user(publisher, lookId);
                UserFeed.update4tags(tags, lookId);
                callback();
            }
        ], function (err, results) {
            callback(err, look);
        });
    });
};

