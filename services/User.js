/**
 * Created by daisy on 14-9-30.
 */
var async = require('async');
var User = require('../models/User');

var helper = require('../common/helper');

module.exports = {
    /**
     * @param condition Object{account, password, tag, token}
     * @param callback
     */
    online: function (condition, callback) {
        async.waterfall([
            function (callback) {
                User.getOne(condition, callback);
            },
            function (user, callback) {
                if (!user) {
                    return callback({msg: '账号或密码错误', condition: condition});
                }
                async.map(user.access, function (item, callback) {
                    if (item.tag !== condition.tag.trim().toLowerCase()) {
                        return callback(null, item);
                    }
                    if (item.expired <= helper.now()) {
                        return callback({msg: '该账号已过期', condition: condition, actual: user});
                    }
                    if (item.token !== condition.token) {
                        return callback({msg: '该账号已在其它地方登录', condition: condition, actual: user});
                    }
                    crypto.randomBytes(48, function(ex, buf) {
                        var token = buf.toString('hex');
                        condition.token = token;
                        item.token = token;
                        callback(null, item);
                    });
                }, callback);
            },
            function (access, callback) {
                User.updateAccess(condition, access, callback);
            }
        ], callback);
    },
    /**
     *
     * @param condition Object{account, password, tag}
     * @param callback
     */
    offline: function (condition, callback) {
        async.waterfall([
            function (callback) {
                User.getOne(condition, callback);
            },
            function (user, callback) {
                async.map(user.access, function (item, callback) {
                    if (item.tag !== condition.tag.toLowerCase().trim()) {
                        return callback(null);
                    }
                    if (item.expired <= helper.now()) {
                        return callback({msg: '该账号已过期', condition: condition, actual: user});
                    }
                    item.token = null;
                    callback(null, item);
                }, callback);
            },
            function (access, callback) {
                User.updateAccess(condition, access, callback);
            }
        ], callback);
    },
    add: function (account, password, callback) {
        var user = new User({account: account, password: password});
        user.save(callback);
    },
    active: function (account, password, tag, expired, callback) {
        User.active({account: account, password: password, tag: tag, expired: expired}, callback);
    }
};