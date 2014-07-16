/**
 * Created by daisy on 14-7-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var logger = require('../common/logger');

var Favorite = Schema(
    {
        _id: String,//lookID:favoriteKey
        wants: [{ type: String, ref: 'User'}],//User:想要的人
        tips: [{type: String, ref: 'Tip'}]//Tips:小贴士
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

Favorite.set('toObject', { virtuals: true });

Favorite.virtual('aspect').get(function () {
    return this._id.split(':')[1];
});

Favorite.static('sync', function (uid, lookId, favoriteKey, callback) {
    var Model = this.model('Favorite');
    var favorite = new Model({
        _id: lookId + ':' + favoriteKey,
        wants: [uid],
        tips:[]
    });
    favorite.save(callback);
});

Favorite.static('putNewTip', function (lookId, favoriteKey, tipId, callback) {
    this.update(
        {
            _id: lookId + ':' + favoriteKey
        },
        {
            $addToSet: {
                tips: tipId
            }
        },
        callback
    );
});
Favorite.static('perfect', function (lookId, favoriteKeys, callback) {
    if (favoriteKeys.length <= 0) {
        return callback(null, []);
    }
    var self = this;
    async.map(favoriteKeys, function (favoriteKey, callback) {
        callback(null, lookId + ':' + favoriteKey);
    }, function (err, favoriteIds) {
        self.find(
            {
                _id: {
                    $in: favoriteIds
                }
            },
            {
                aspect: 1,
                wants: 1,
                tips: 1
            },
            {
                lean: true
            },
            function (err, favorites) {
                if (err || favorites.length <= 0) {
                    return callback(err, []);
                }
                async.map(favorites, function (favorite, callback) {
                    favorite._id = favorite._id.split(':')[1];
                    callback(null, favorite);
                }, callback)
            }
        );
    })
});

module.exports = mongoose.model('Favorite', Favorite);