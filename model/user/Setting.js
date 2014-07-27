/**
 * Created by daisy on 14-6-21.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var types = require('../../common/config')('settings');


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

UserSetting.static('change', function (uid, settings, callback) {
    var filter = {};
    for(var setting in types) {
        filter[setting] = (typeof settings[setting] === 'undefined' ? true : settings[setting]);
    }
    settings['_id'] = uid;
    this.update(
        {
            _id: uid
        },
        filter,
        {
            upsert: true
        },
        callback
    );
});

UserSetting.static('retrieve', function (uid, callback) {
    this.findById(uid, callback);
});

module.exports = mongoose.model('UserSetting', UserSetting);