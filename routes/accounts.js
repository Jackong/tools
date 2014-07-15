/**
 * Created by daisy on 14-5-30.
 */
var async = require('async');
require('../common/mongo');

var User = require('../model/User');
var UserService = require('../services/User');

var logger = require('../common/logger');
var helper = require('../common/helper');
var USER_PLATFORM = require('../common/const').USER_PLATFORM;

module.exports = function (router) {
    router.post('/accounts',
        router.checker.body('account', 'password'),
        function register(req, res) {
            UserService.register(USER_PLATFORM.EMAIL, req.body.account, req.body.password, function (err, user) {
                if (null !== err) {
                    logger.error('create account', req.body.account, err.message);
                    return res.fail();
                }
                UserService.login(user._id, req, res);
                res.ok();
            })
        });

    router.put('/accounts',
        router.checker.body('oldPassword', 'password'),
        function updatePassword(req, res) {
            var uid = UserService.getUid(req, res);
            if (!uid) {
                return res.fail('登录状态已经过期', res.CODE.UN_LOGIN);
            }
            async.waterfall([
                function (callback) {
                    UserService.getPasswordById(uid, callback);
                },
                function (user, callback) {
                    if (user.password === req.body.oldPassword) {
                        return callback('invalid old password');
                    }
                    UserService.resetPasswordById(uid, req.body.password, callback)
                }
            ], function (err, num) {
                if (null !== err || num !== 1) {
                    logger.error('update password', uid, num, err);
                    return res.fail('修改密码失败，请重试');
                }
                UserService.logout(uid, req, res);
                res.ok();
            });
        });

    router.get('/accounts/check',
        function checkLogin(req, res) {
            var uid = UserService.getUid(req, res);
            if (uid) {
                return res.ok();
            }
            return res.fail();
        });

    router.get('/accounts/forgot/:account',
        router.checker.params('account'),
        function forget(req, res) {
            var sign = UserService.forgotSign(req.params.account);
            var url = req.protocol + '://' + req.host
                + '/account/reset/' + req.params.account + '?sign=' + sign;
            helper.email(req.params.account, '密码找回【iWomen】', '<!--HTML--><a href="' + url + '">点击找回密码（30分钟内有效，请匆回复）</a>')
            res.ok();
        });

    router.put('/accounts/reset/:account',
        router.checker.params('account'),
        router.checker.body('password', 'sign'),
        function reset(req, res) {
            var canReset = UserService.canReset(req.params.account, req.body.sign);
            if (!canReset) {
                return res.fail('链接无效或已过期');
            }
            UserService.resetPassword(USER_PLATFORM.EMAIL, req.params.account, req.body.password, function (err, num) {
                if (null !== err) {
                    logger.error('update password', req.params.account, num, err.message);
                    return res.fail('修改密码失败，请重试');
                }
                if (1 !== num) {
                    logger.error('update password', req.params.account, num);
                    return res.fail('原密码错误');
                }
                UserService.logout(uid, req, res);
                return res.ok();
            })
        });

    router.get('/accounts/:account',
        router.checker.params('account'),
        router.checker.query('password'),
        function login(req, res) {
            UserService.getPassword(USER_PLATFORM.EMAIL, req.params.account, function (err, user) {
                if (null === user || req.query.password !== user.password) {
                    logger.error('login', user);
                    return res.fail();
                }
                UserService.login(user._id, req, res);
                return res.ok();
            });
        });
};
