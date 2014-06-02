/**
 * Created by daisy on 14-5-30.
 */

var auth = require('../services/auth');
var logger = require('../common/logger');

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
                auth.updatePassword(req.params.account, req.body.password, function (err) {
                    res.error(err, req);
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

    router.route('/accounts/forgot/:account')
        .get(router.checker.params('account'))
        .get(function forget(req, res) {
            //todo: 生成一个会过期的重置页面链接发到邮箱
        });

    router.route('/accounts/reset/:account')
        .put(router.checker.params('account'))
        .put(router.checker.body('password'))
        .put(function reset(req, res) {
            //todo: 检测签名及是否过期
            //todo: 重置密码
            //todo: 使链接过期
        })

};