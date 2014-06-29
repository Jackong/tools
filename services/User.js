/**
 * Created by daisy on 14-6-25.
 */
var helper = require('../common/helper');

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
    getUid: function (req, res) {
        return req.signedCookies.uid;
    }
};