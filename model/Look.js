/**
 * Created by daisy on 14-6-4.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logger = require('../common/logger');

var Look = Schema(
    {
        _id: String,//文件MD5
        publisher: {type: String, ref: 'User'},//User:发布者
        image: String,//图片
        isValid: {type: Boolean, default: true},
        tags: [{type: String, lowercase: true, trim: true}],//标签
        description: String,//描述
        created: {type: Number, default: Date.now},
        updated: {type: Number, default: Date.now},
        likes: [{ type: String, ref: 'User' }],//User:喜欢的人
        favorites: [{type: String, ref: 'Favorite'}]//Favorite:心仪的东西
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);


Look.static('appendTagsAndFavorites', function (lookId, tags, favorites, time, callback) {
    return this.update(
        {
            _id: lookId
        },
        {
            updated: time,
            $addToSet: {
                tags: {
                    $each: tags
                },
                favorites: {
                    $each: favorites
                }
            }
        },
        {
            upsert: true
        },
        callback
    );
});

Look.static('getTrend', function (start, num, callback) {
    if (start < 0 || num <= 0) {
        return callback(null, []);
    }
    this.find(
        {
            isValid: true
        },
        {
            publisher: 1,
            image: 1,
            tags: 1,
            description: 1,
            updated: 1,
            favorites: 1
        },
        {
            lean: true,
            $skip: start,
            $limit: num,
            $sort: {
                updated: -1
            }
        }
        , callback);
});


Look.static('gets', function (lookIds, callback) {
    this.find(
        {
            _id: {
                $in: lookIds
            },
            isValid: true
        },
        {
            image: 1,
            tags: 1,
            description: 1,
            updated: 1,
            favorites: 1
        },
        {
            lean: true
        },
        callback
    )
});

Look.static('getOne', function (lookId, callback) {
    this.findOne(
        {
            _id: lookId,
            isValid: true
        },
        {
            publisher: 1,
            image: 1,
            tags: 1,
            description: 1,
            updated: 1,
            favorites: 1
        },
        {
            lean: true
        },
        callback
    );
});

module.exports = mongoose.model('Look', Look);