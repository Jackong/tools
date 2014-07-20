/**
 * Created by daisy on 14-6-25.
 */

var User = require('../model/User');
var helper = require('../common/helper');
var system = require('../common/config')('system');

module.exports = {
    forgotSign: function (account) {
        return helper.encrypt(JSON.stringify({account: account, expiration: helper.time() + 30 * 60}));
    },
    canReset: function (account, sign) {
        try {
            var data = JSON.parse(helper.decrypt(sign));
            if (null === data || data.account !== account || data.expiration <= helper.time()) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    },
    login: function (uid, req, res) {
        res.cookie('uid', uid, { signed: true, httpOnly: true, maxAge: 86400000 * 15, path: '/' })
    },
    logout: function (req, res) {
        res.clearCookie('uid', { path: '/' });
    },
    getUid: function (req, res) {
        return req.signedCookies.uid;
    },
    register: function (platform, account, password, callback) {
        var user = new User({
            _id: this.createUid(platform, account),
            account: account,
            password: password,
            platform: platform
        });
        user.save(callback);
    },
    resetPassword: function (platform, account, password, callback) {
        this.resetPasswordById(this.createUid(platform, account), password, callback);
    },
    resetPasswordById: function (uid, password, callback) {
        User.update({_id: uid}, {password: password}, callback);
    },
    getPassword: function (platform, account, callback) {
        this.getPasswordById(this.createUid(platform, account), callback);
    },
    getPasswordById: function (uid, callback) {
        User.findOne({_id: uid}, 'password', {lean: true}, callback);
    },
    login4Platform: function (platform, mediaUid, socialUid, accessToken, sessionKey, sessionSecret, callback) {
        
    },
    createUid: function (platform, account) {
        return helper.md5(platform + '|' + account, system.salt);
    }
};
