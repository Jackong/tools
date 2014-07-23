/**
 * Created by daisy on 14-6-4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Auth = Schema(
    {
        _id: {type: String, lowercase: true, trim: true},//account or openID
        token: {type: String, lowercase: true, trim: true},//password or access token
        platform: Number,
        user: {type: String, ref: 'User'},//UID
        created: {type: Number, default: Date.now},
        updated: {type: Number, default: Date.now},
        expires: {type: Number, default: 0}//0: never
    },
    {
        shardKey: {
            _id: 1,
            platform: 1
        }
    }
);

Auth.static('createOrUpdate', function (authId, token, platform, uid, updated, expires, callback) {
    this.update(
        {
            _id: authId,
            platform: platform
        },
        {
            _id: authId,
            token: token,
            platform: platform,
            user: uid,
            updated: updated,
            expires: expires
        },
        {
            upsert: true
        },
        callback
    );
});

module.exports = mongoose.model('Auth', Auth);
