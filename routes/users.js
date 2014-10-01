/**
 * Created by daisy on 14-9-30.
 */
var logger = require('../common/logger');
require('../common/mongo');
var UserService = require('../services/User');
module.exports = function users(router) {
    router.post('/users/online', function getUser(req, res) {
        var account = req.body.account;
        var password = req.body.password;
        var tag = req.body.tag;
        var token = req.body.token;
        var condition = {
            _id: account,
            password: password,
            tag: tag,
            token: token
        };
        UserService.online(condition, function (err, num) {
            if (err || num < 1) {
                logger.error('fail to online', {err: err, num: num});
                return res.fail(err.msg ? err.msg : '无法上线', res.CODE.FAILURE);
            }
            res.ok({token: condition.token});
        })
    });

    router.post('/users/offline', function (req, res) {
        var account = req.body.account;
        var password = req.body.password;
        var tag = req.body.tag;
        var condition = {
            _id: account,
            password: password,
            tag: tag
        };

        UserService.offline(condition, function (err, num) {
            if (err || num < 1) {
                logger.error('fail to offline', {err: err, num: num});
                return res.fail(err.msg ? err.msg : '无法下线', res.CODE.FAILURE)
            }
            res.ok({token: null});
        });
    });

    router.post('/users/add', function (req, res) {
        var account = req.body.account;
        var password = req.body.password;
        var secret = req.body.secret;
        if (secret !== '7777777') {
            logger.error('wrong secret', {secret: secret});
            return res.fail('管理员密码错误', res.CODE.FAILURE);
        }
        UserService.add(account, password, function (err, user) {
            if (err || !user) {
                logger.error('fail to add user', {account: account, password: password, err: err, user: user});
                return res.fail('添加账号失败', res.CODE.FAILURE);
            }
            res.ok({account: account, password: password});
        });
    });

    router.put('/users/active', function (req, res) {
        var account = req.body.account;
        var password = req.body.password;
        var secret = req.body.secret;
        var tag = req.body.tag;
        var expired = req.body.expired;

        if (secret !== '7777777') {
            logger.error('wrong secret', {secret: secret});
            return res.fail('管理员密码错误', res.CODE.FAILURE);
        }

        UserService.active(account, password, tag, expired, function (err, num) {
            if (err || num < 1) {
                logger.error('fail to add user', {
                    account: account,
                    password: password,
                    tag: tag,
                    expired: expired,
                    err: err,
                    num: num
                });
                return res.fail('激活失败', res.CODE.FAILURE);
            }
            res.ok();
        });
    })
};