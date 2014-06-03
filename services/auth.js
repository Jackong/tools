/**
 * Created by daisy on 14-5-30.
 */
var Auth = require('../model/Auth');
var redis = require('../common/redis');
var util = require('../common/util');
var system = require('../common/config')('system');

module.exports = {
    create: function (account, password, cb) {
        var auth = new Auth({ account: account, password: password, time: util.date()});
        auth.save(cb);
    },
    updatePassword: function (account, password, cb) {
        Auth.update({account: account}, {password: password}, cb);
    },
    del: function (account, cb) {
        Auth.remove({account: account}, cb);
    },
    get: function (account, cb) {
        Auth.findOne({account: account}, cb);
    },
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
    }
};
