/**
 * Created by daisy on 14-5-30.
 */

var auth = require('../services/auth');
var logger = require('../common/logger');
var message = require('bae-message');
var msgConfig = require('../common/config')('message');

module.exports = function (router) {
    router.route('/accounts')
        .post(router.checker.body('account', 'password'))
        .post(function register(req, res) {
            auth.create(req.body.account, req.body.password, function (err) {
                res.error(err, req);
            });
        });

    router.route('/accounts/:account')
        .put(router.checker.params('account'))
        .put(router.checker.body('oldPassword'))
        .put(router.checker.body('password'))
        .put(function updatePassword(req, res) {
            auth.get(req.params.account, function (err, account) {
                if (null  === account) {
                    return res.fail(req);
                }
                if (req.body.oldPassword !== account.password) {
                    return res.fail(req);
                }
                auth.updatePassword(req.params.account, req.body.password, function (err, num) {
                    null === err && num === 1 ? res.ok() : res.fail(req);
                });
            });
        });

    router.route('/accounts/:account')
        .get(router.checker.params('account'))
        .get(router.checker.query('password'))
        .get(function login(req, res) {
            auth.get(req.params.account, function (err, account) {
                if (null === account) {
                    return res.fail(req);
                }

                if (req.query.password !== account.password) {
                    return res.fail(req);
                }
                return res.ok();
            });
        });

    router.route('/accounts/forgotSign/:account')
        .get(router.checker.params('account'))
        .get(function forget(req, res) {
            var sign = auth.forgotSign(req.params.account);
            var url = req.protocol + '://' + req.host
                + '/account/canReset/' + req.params.account + '?sign=' + sign;
            var bae = new message({
                key : msgConfig.key,
                secret : msgConfig.secret,
                queue: msgConfig.queue
            });
            bae.mail('no-reply', req.params.account, '密码找回【iWomen】', '<!--HTML--><a href="' + url + '">点击找回密码（请匆回复）</a>');
            res.ok();
        });

    router.route('/accounts/canReset/:account')
        .put(router.checker.params('account'))
        .put(router.checker.body('password'))
        .put(router.checker.body('sign'))
        .put(function reset(req, res) {
            var canReset = auth.canReset(req.params.account, req.body.sign);
            if (!canReset) {
                return res.fail(req);
            }
            auth.updatePassword(req.params.account, req.body.password, function (err, num) {
                null === err && num === 1 ? res.ok() : res.fail(req);
            });
        })

};