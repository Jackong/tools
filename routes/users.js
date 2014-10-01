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
            account: account,
            password: password,
            tag: tag,
            token: token
        };
        UserService.online(condition, function (err, num) {
            if (err || num < 1) {
                return res.fail(res.CODE.FAILURE, err.msg ? err.msg : '无法上线');
            }
            res.ok({token: condition.token});
        })
    });

    router.post('/users/offline', function (req, res) {
        var account = req.body.account;
        var password = req.body.password;
        var tag = req.body.tag;
        var condition = {
            account: account,
            password: password,
            tag: tag
        };

        UserService.offline(condition, function (err, num) {
            if (err || num < 1) {
                return res.fail(res.CODE.FAILURE, err.msg ? err.msg : '无法下线')
            }
            res.ok({token: null});
        })
    });
};