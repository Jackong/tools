/**
 * Created by daisy on 14-6-4.
 */
var util = require('../common/util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = Schema({
    account: {type: String, unique: true, lowercase: true, trim: true},
    password: String,
    nick: String,
    avatar: String,
    sex: {type: Boolean, default: true},
    birthday: Date,
    city: String,
    webSite: String,
    intro: String,
    points: {type: Number, default: 0},
    isValid: {type: Boolean, default: true},
    time: {type: Date, default: Date.now },
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
    notifications: [{type: Schema.Types.ObjectId}],//Notification
    followers: [{type: Schema.Types.ObjectId}],//User
    following: {
        users: {type: Schema.Types.ObjectId},//User
        tags: {type: String, lowercase: true, trim: true}//Tag
    },
    looks: [{type: String}],//Look
    likes: [{type: String}],//Look
    wants: [{type: String}],//Look
    tips: [{type: String}]//Look
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