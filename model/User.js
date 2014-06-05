/**
 * Created by daisy on 14-6-4.
 */
var util = require('../common/util');
var mongoose = require('mongoose');

var User = mongoose.Schema({
    account: {type: String, unique: true, lowercase: true, trim: true},
    password: String,
    nick: String,
    avatar: String,
    settings: {
        notifications: {
            isNotify: {type: Boolean, default: true},
            isMail: {type: Boolean, default: true},
            likeMyTip: {type: Boolean, default: true},
            comment: {type: Boolean, default: true},
            likeMyLook: {type: Boolean, default: true},
            tipMyWant: {type: Boolean, default: true},
            wantMyLook: {type: Boolean, default: true},
            followMe: {type: Boolean, default: true}
        }
    },
    time: {type: Date, default: Date.now }
});

util.modelMethods(User.statics, {
    forgotSign: function (account) {
        return util.encrypt(JSON.stringify({account: account, expiration: util.time() + 30 * 60}));
    },
    canReset: function (account, sign) {
        try {
            var data = JSON.parse(util.decrypt(sign));
            if (null === data || data.account !== account || data.expiration <= util.time()) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    },
    login: function (account, req, res) {
        res.cookie('token', account, { signed: true, httpOnly: true, maxAge: 86400 * 15, path: '/' })
    },
    getAccount: function (req, res) {
        return req.signedCookies.token;
    }
});

module.exports = mongoose.model('User', User);