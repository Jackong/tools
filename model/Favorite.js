/**
 * Created by daisy on 14-7-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var logger = require('../common/logger');

var Favorite = Schema(
    {
        look: {type: String, ref: 'Look'},
        aspect: String,
        wants: [{ type: String, ref: 'User'}],//User:想要的人
        tips: [{type: String, ref: 'Tip'}]//Tips:小贴士
    },
    {
        shardKey:
        {
            look: 1,
            aspect: 1
        }
    }
);

Favorite.static('sync', function (uid, lookId, aspect, callback) {
    var Model = this.model('Favorite');
    var favorite = new Model({
        look: lookId,
        aspect: aspect,
        wants: [uid],
        tips:[]
    });
    favorite.save(callback);
});

Favorite.static('putNewTip', function (lookId, aspect, tipId, callback) {
    this.update(
        {
            look: lookId,
            aspect: aspect
        },
        {
            $addToSet: {
                tips: tipId
            }
        },
        callback
    );
});

Favorite.static('perfect', function (lookId, aspects, callback) {
    if (aspects.length <= 0) {
        return callback(null, []);
    }
    this.find(
        {
            look: lookId,
            aspect: {
                $in: aspects
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
        callback
    );
});

Favorite.static('want', function (lookId, aspect, uid, callback) {
    this.update(
        {
            look: lookId,
            aspect: aspect
        },
        {
            wants: {
                $addToSet: uid
            }
        },
        callback
    );
});

module.exports = mongoose.model('Favorite', Favorite);