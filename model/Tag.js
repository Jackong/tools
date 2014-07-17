/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var Tag = Schema(
    {
        _id: {type: String, lowercase: true, trim: true},//标签名
        icon: String,//图标
        looks: [{type: String, ref: 'Look'}],
        followers: [{type: String, ref: 'User'}],
        isValid: {type: Boolean, default: true},
        created: {type: Number, default: Date.now },
        updated: {type: Number, default: Date.now }
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);


Tag.static('putNewLook', function (tags, lookId, callback) {
    if (tags.length <= 0) {
        return callback('can not put new look ' + lookId + ' to empty tags');
    }
    var self = this;
    async.each(tags, function (tag, callback) {
        self.update(
            {
                _id: tag
            },
            {
                $addToSet:
                {
                    looks: lookId
                }
            },
            {
                upsert: true
            },
            callback
        );
    }, callback);
});

Tag.static('calLookCount', function (tag, callback) {
    this.aggregate(
        { $project: { looks: 1 }},
        { $unwind: '$looks' },
        { $group: { _id: '$_id', count: { $sum: 1 }}},
        {$match: {_id: tag}},
        callback
    );
});
module.exports = mongoose.model('Tag', Tag);