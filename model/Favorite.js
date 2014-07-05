/**
 * Created by daisy on 14-7-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var Favorite = Schema({
    _id: String,//lookID:favoriteKey
    wants: [{ type: Schema.Types.ObjectId }],//User:想要的人
    tips: [{type: Schema.Types.ObjectId}]//Tips:小贴士
});

Favorite.static('sync', function (uid, lookId, favoriteKey, callback) {
    var favorite = new this.model('Favorite')({
        _id: lookId + ':' + favoriteKey,
        wants: [uid]
    });
    favorite.save(callback);
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
                lean: true
            },
            callback
        );
    })
});

module.exports = mongoose.model('Favorite', Favorite);