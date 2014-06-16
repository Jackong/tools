/**
 * Created by daisy on 14-6-4.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var TagLook = require('./tag/Look');
var UserPublication = require('./user/Publication');
var UserWant = require('./user/Want');
var UserFeed = require('./user/Feed');
var User = require('./User');

var logger = require('../common/logger');

var Favorite = Schema({
    _id: String,//aspect
    wants: [{ type: Schema.Types.ObjectId }],//User:想要的人
    wantCount: {type: Number, default: 0},
    tips: [{type: Schema.Types.ObjectId}],//Tip:提示信息
    tipCount: {type: Number, default: 0}
});

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
    favorites: [Favorite]//Favorite:心仪的东西
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

    for(var idx = 0; idx < doc.favorites.length; idx++) {
        var favorite = doc.favorites[idx];
        if (favorite._id == this.favorites[0]._id) {
            this.favorites.pop();
            break;
        }
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

module.exports = mongoose.model('Look', Look);