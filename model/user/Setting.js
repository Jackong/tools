/**
 * Created by daisy on 14-6-21.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var types = require('../../common/const').SETTING_TYPE;

var UserSetting = Schema(
    {
        _id: {type: String, ref: 'User'},
        notify: {type: Boolean, default: true},
        mail: {type: Boolean, default: true},
        likeMyTip: {type: Boolean, default: true},
        commentMyTip: {type: Boolean, default: true},
        likeMyLook: {type: Boolean, default: true},
        tipMyWant: {type: Boolean, default: true},
        wantMyLook: {type: Boolean, default: true},
        followMe: {type: Boolean, default: true},
        created: {type: Number, default: Date.now },
        updated: {type: Number, default: Date.now }
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

UserSetting.static('change', function (uid, type, status, callback) {
    var obj = {};
    obj[type] = status;
    this.update(
        {
            _id: uid
        },
        obj,
        {
            upsert: true
        },
        callback
    );
});

UserSetting.static('get', function (uid, callback) {
    this.findById(uid, callback);
});

module.exports = mongoose.model('UserSetting', UserSetting);