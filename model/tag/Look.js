/**
 * Created by daisy on 14-6-9.
 */
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * tag._id as _id
 */
var TagLook = Schema({
    _id: {type: String, lowercase: true, trim: true},
    looks: [{type: String}]
});

TagLook.static('putNewLook', function (tags, lookId, callback) {
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

TagLook.static('calLookCount', function (tag, callback) {
    this.aggregate( { $project: { looks: 1 }},
        { $unwind: '$looks' },
        { $group: { _id: 'result', count: { $sum: 1 }}}, callback);
});
module.exports = mongoose.model('TagLook', TagLook);