/**
 * Created by daisy on 14-6-21.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSetting = Schema({
    notification: {
        enableNotify: {type: Boolean, default: true},
        enableMail: {type: Boolean, default: true},
        likeMyTip: {type: Boolean, default: true},
        comment: {type: Boolean, default: true},
        likeMyLook: {type: Boolean, default: true},
        tipMyWant: {type: Boolean, default: true},
        wantMyLook: {type: Boolean, default: true},
        followMe: {type: Boolean, default: true},
        created: {type: Number, default: Date.now },
        updated: {type: Number, default: Date.now }
    }
});

module.exports = mongoose.model('UserSetting', UserSetting);