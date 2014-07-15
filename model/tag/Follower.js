/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * tag._id as _id
 */
var TagFollower = Schema(
    {
        _id: {type: String, lowercase: true, trim: true},
        followers: [{type: String}]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

module.exports = mongoose.model('TagFollower', TagFollower);
