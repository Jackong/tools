/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Follower = Schema({
    followers: [{type: Schema.Types.ObjectId}],
    followerCount: {type: Number, default: 0}
});

module.exports = mongoose.model('UserFollower', Follower);