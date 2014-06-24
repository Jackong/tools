/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserFollowing = Schema({
    followings: [{type: Schema.Types.ObjectId}]
});

module.exports = mongoose.model('UserFollowing', UserFollowing);