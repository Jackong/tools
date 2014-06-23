/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Look = Schema({
    _id: {type: String, lowercase: true, trim: true},
    looks: [{type: String}],
    lookCount: {type: Number, default: 0}
});

Look.static('putNewLook', function (tags, lookId, callback) {
    async.each(tags, function (tag, callback) {
        this.update(
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
            },
            callback
        );
    }, callback);

});

module.exports = mongoose.model('TagLook', Look);