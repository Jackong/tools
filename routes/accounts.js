/**
 * Created by daisy on 14-5-30.
 */

var User = require('../model/User');
var logger = require('../common/logger');
var util = require('../common/util');

module.exports = function (router) {
    router.route('/accounts')
        .post(router.checker.body('account', 'password'))
        .post(function register(req, res) {
            var user = new User({account: req.body.account, password: req.body.password});
            user.save(function (err, user) {
                if (null !== err) {
                    logger.error('create account', req.body.account, err.message);
                    return res.fail();
                }
                User.login(user._id, req, res);
                res.ok();
            });
        });

    router.route('/accounts')
        .put(router.checker.body('oldPassword'))
        .put(router.checker.body('password'))
        .put(function updatePassword(req, res) {
            var uid = User.getUid(req, res);
            if (!uid) {
                return res.fail('登录状态已经过期', res.CODE.UN_LOGIN);
            }
            User.update({_id: uid, password: req.body.oldPassword }, {password: req.body.password}, function (err, num) {
                if (null !== err) {
                    logger.error('update password', uid, num, err.message);
                    return res.fail('修改密码失败，请重试');
                }
                if (1 === num) {
                    return res.ok();
                }
                logger.error('update password', uid, num);
                return res.fail('原密码错误');
            });
        });

    router.route('/accounts/check')
        .get(function checkLogin(req, res) {
            var uid = User.getUid(req, res);
            if (uid) {
                return res.ok();
            }
            return res.fail();
        });

    router.route('/accounts/forgot/:account')
        .get(router.checker.params('account'))
        .get(function forget(req, res) {
            var sign = User.forgotSign(req.params.account);
            var url = req.protocol + '://' + req.host
                + '/account/reset/' + req.params.account + '?sign=' + sign;
            util.email(req.params.account, '密码找回【iWomen】', '<!--HTML--><a href="' + url + '">点击找回密码（30分钟内有效，请匆回复）</a>')
            res.ok();
        });

    router.route('/accounts/reset/:account')
        .put(router.checker.params('account'))
        .put(router.checker.body('password'))
        .put(router.checker.body('sign'))
        .put(function reset(req, res) {
            var canReset = User.canReset(req.params.account, req.body.sign);
            if (!canReset) {
                return res.fail('链接无效或已过期');
            }
            User.update({account: req.params.account }, {password: req.body.password}, function (err, num) {
                if (null !== err) {
                    logger.error('update password', account, num, err.message);
                    return res.fail('修改密码失败，请重试');
                }
                if (1 === num) {
                    return res.ok();
                }
                logger.error('update password', account, num);
                return res.fail('原密码错误');
            });
        });

    router.route('/accounts/:account')
        .get(router.checker.params('account'))
        .get(router.checker.query('password'))
        .get(function login(req, res) {
            User.findOne({account: req.params.account}, 'password', {lean: true}, function (err, user) {
                if (null === user || req.query.password !== user.password) {
                    logger.error('login', user);
                    return res.fail();
                }
                User.login(user._id, req, res);
                return res.ok();
            });
        });



};
