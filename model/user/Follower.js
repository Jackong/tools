/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserFollower = Schema(
    {
        _id: {type: String, ref: 'User'},
        followers: [{type: String, ref: 'User'}]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

module.exports = mongoose.model('UserFollower', UserFollower);