/**
 * Created by daisy on 14-5-29.
 */

var logger = require('../common/logger');
require('../common/mongo');
var UserService = require('../services/User');
module.exports = function users(router) {
    router.get('/users/:uid', function getUser(req, res) {
        var uid = req.params.uid;
        UserService.getUserInfo(uid, function (err, user) {
            if (err || !user) {
                logger.error('get user info fail', uid, {err: err, user: user});
                return res.fail();
            }
            res.ok({user: user});
        });
    });

    router.get('/users', function getUser(req, res) {
        var uid = UserService.getUid(req, res);
        UserService.getUserInfo(uid, function (err, user) {
            if (err || !user) {
                logger.error('get user info fail', uid, {err: err, user: user});
                return res.fail();
            }
            res.ok({user: user});
        });
    });
};
