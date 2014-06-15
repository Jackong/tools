/**
 * Created by daisy on 14-6-4.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var Favorite = require('./Favorite');
var TagLook = require('./tag/Look');
var UserPublication = require('./user/Publication');
var UserWant = require('./user/Want');
var UserFeed = require('./user/Feed');
var User = require('./User');

var logger = require('../common/logger');

var Look = Schema({
    _id: String,//文件MD5
    publisher: Schema.Types.ObjectId,//User:发布者
    image: String,//图片
    isValid: {type: Boolean, default: true},
    tags: [{type: String, lowercase: true, trim: true}],//标签
    description: String,//描述
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    likes: [{ type: Schema.Types.ObjectId }],//User:喜欢的人
    likeCount: {type: Number, default: 0},
    favorites: [{type: String}]//Favorite:心仪的东西
});

var aspect = Look.virtual('aspect');

Look.post('save', function saveFavorite(doc) {
    var favorite = new Favorite({_id: doc.favorites[0], wants:[doc.publisher]});
    favorite.save();
});


Look.post('save', function syncTag(doc) {
    for(var idx = 0; idx <= doc.tags.length; idx++) {
        TagLook.update(
            {
                _id: doc.tags[idx]
            },
            {
                $addToSet:
                {
                    looks: doc._id
                }
            },
            {
                upsert: true
            }
        ).exec();
    }
});

Look.post('save', function syncPublication(doc) {
    UserPublication.update(
        {
            _id: doc.publisher
        },
        {
            $addToSet:
            {
                publications: doc._id
            }
        },
        {
            upsert: true
        }
    ).exec();
});

Look.post('save', function syncWant(doc) {
    UserWant.sync(doc.publisher, doc._id);
});

Look.post('save', function syncFeed(doc) {
    UserFeed.update4user(doc.publisher, doc._id);
    UserFeed.update4tags(doc.tags, doc._id);
});

Look.method('republish', function (doc, callback) {
    var tags = [];
    for (var tagIndex = 0; tagIndex < this.tags.length; tagIndex++) {
        var tag = this.tags[tagIndex];
        if (doc.tags.indexOf(tag) > -1) {
            continue;
        }
        tags.push(tag);
    }
    this.tags = tags;
    UserFeed.update4tags(tags, doc._id);

    if (doc.publisher !== this.publisher) {
        UserWant.sync(this.publisher, doc._id);
        UserFeed.update4user(this.publisher, doc._id);
    }

    var favoriteId = this.favorites[0];
    if (doc.favorites.indexOf(favoriteId) < 0) {
        var favorite = new Favorite({_id: favoriteId, wants:[this.publisher]});
        favorite.save();
    } else {
        this.favorites.pop();
    }

    var self = this;
    this.model('Look').update(
        {
            _id: this._id
        },
        {
            $addToSet: {
                tags: {
                    $each: this.tags
                },
                favorites: {
                    $each: this.favorites
                }
            }
        },
        {
            upsert: true
        },
        function (err, num) {
            doc.tags = doc.tags.concat(tags);
            doc.favorites = doc.favorites.concat(self.favorites);
            if (null !== err || num !== 1) {
                doc = null;
            }
            callback(err, doc);
        }
    );
});

Look.method('publish', function (callback) {
    var self = this;
    this.model('Look').findById(this._id, function (err, doc) {
        if (null === err && null !== doc) {
            self.republish(doc, callback);
        }
        self.save(callback);
    });
});

Look.static('feeds', function (uid, skip, limit, cb) {
    var self = this;
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
            self.find(
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
        function findPublishers(looks, callback) {
            var uids = [];
            async.each(looks, function (look, callback) {
                uids.push(look.publisher);
                callback();
            }, function (err) {
                User.find(
                    {
                        _id: {
                            $in: uids
                        }
                    },
                    {
                        nick: 1,
                        avatar: 1
                    },
                    function (err, users) {
                        callback(err, looks, users);
                    }
                );
            });
        },
        function makeUserMap(looks, users, callback) {
            if (users.length <= 0) {
                return callback('users not found', null);
            }
            var userMap = [];
            async.each(users, function (user, callback) {
                userMap[user._id] = user;
                callback();
            }, function (err) {
                callback(null, looks, userMap);
            });
        },
        function attachPublisher(looks, userMap, callback) {
            async.filter(looks, function (look, callback) {
                var user = userMap[look.publisher];
                if (typeof user === 'undefined') {
                    return callback(false);
                }
                look.publisher = user;
                callback(true);
            }, function (looks) {
                callback(null, looks);
            });
        }/*,
        function (looks, callback) {
            async.each(looks, function (look, callback) {

            });
        }*/
    ],cb);
});

module.exports = mongoose.model('Look', Look);