/**
 * Created by daisy on 14-7-20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserOAuth = Schema(
    {
        _id: {type: String, ref: 'User'},
        accessToken:String,
        createAt: {type: Date, expires: 7776000},
        sessionKey: String,
        sessionSecret: String,
        mediaUid: String,
        socialUid: String
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

module.exports = mongoose.model('UserOAuth', UserOAuth);