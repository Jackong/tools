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
    forgot: function (account, cb) {
        var sign = util.md5(account, system.salt);
        redis.setex(redis.PREFIX.ACCOUNT_FORGOT + account, 30 * 60, sign, function (err, result) {
        });
        return sign;
    },
    reset: function (account, sign, password, cb) {
        var okSign = util.md5(account, system.salt);
        if (sign !== okSign) {
            return cb(false,  account + ': invalid sign');
        }
        var _self = this;
        redis.get(redis.PREFIX.ACCOUNT_FORGOT + account, function (err, result) {
            if (null !== err) {
                return cb(false, account + ': can not get sign');
            }
            if (null === result) {
                return cb(false, account + ': sign is expired')
            }
            _self.updatePassword(account, password, function (err, numberAffected) {
                if (null === err && numberAffected === 1) {
                    redis.del(redis.PREFIX.ACCOUNT_FORGOT + account);
                    return cb(true);
                }
                return cb(false, account + ': reset password fail, error: ' + err.message);
            });
        });
    }
};