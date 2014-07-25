/**
 * Created by daisy on 14-7-25.
 */

var logger = require('../common/logger');
require('../common/mongo');
var UserService = require('../services/User');
var Setting = require('../model/user/Setting');
var types = require('../common/const').SETTING_TYPE;

module.exports = function users(router) {
    router.put('/settings',
        router.checker.body('settingType'),
        function (req, res) {
            var uid = UserService.getUid(req, res);
            Setting.change(uid, types[req.body.settingType], req.body.status === 'enable', function (err, num) {
                if (err || num !== 1) {
                    logger.error('setting fail', {uid: uid, body: req.body, err: err, num: num});
                    return res.fail();
                }
                res.ok();
            })
        }
    );

    router.get('/settings',
        function (req, res) {
            var uid = UserService.getUid(req, res);
            Setting.retrieve(uid, function (err, setting) {
                if (err || !setting) {
                    logger.error('get setting fail', {uid: uid, err: err, setting: setting});
                    return res.fail();
                }
                res.ok({setting: setting});
            })
        }
    );
};