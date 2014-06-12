/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Follower = Schema({
    _id: {type: String, lowercase: true, trim: true},
    followers: [{type: Schema.Types.ObjectId}]
});

module.exports = mongoose.model('TagFollower', Follower);