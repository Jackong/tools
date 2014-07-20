/**
 * Created by daisy on 14-7-20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserPlatform = Schema(
    {
        _id: {type: String, ref: 'User'},
        accessToken:String,
        createAt: {type: Date, default: Date.now, expires: 7776000},
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

UserPlatform.static('sync', function (uid, accessToken, sessionKey, sessionSecret, mediaUid, socialUid, callback) {
    var Model = this.model('UserPlatform');
    var userPlatform = new Model({
        _id: uid,
        accessToken: accessToken,
        sessionKey: sessionKey,
        sessionSecret: sessionSecret,
        mediaUid: mediaUid,
        socialUid: socialUid
    });
    userPlatform.save(callback);
});

module.exports = mongoose.model('UserPlatform', UserPlatform);