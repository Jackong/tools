/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserTag = Schema(
    {
        _id: {type: String, ref: 'User'},
        tags: [{type: String}]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

module.exports = mongoose.model('UserTag', UserTag);