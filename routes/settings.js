/**
 * Created by daisy on 14-7-25.
 */

var async = require('async');
var logger = require('../common/logger');
require('../common/mongo');
var UserService = require('../services/User');
var Setting = require('../model/user/Setting');
var labels = require('../common/config')('settings');

module.exports = function users(router) {
    router.put('/settings',
        function (req, res) {
            var uid = UserService.getUid(req, res);
            Setting.change(uid, req.body.settings, function (err, num) {
                if (err || num !== 1) {
                    logger.error('setting fail', {uid: uid, body: req.body, err: err, num: num});
                    return res.fail('修改设置失败');
                }
                res.ok();
            })
        }
    );

    router.get('/settings',
        function (req, res) {
            var uid = UserService.getUid(req, res);
            Setting.retrieve(uid, function (err, setting) {
                if (err) {
                    logger.error('get setting fail', {uid: uid, err: err});
                    return res.fail();
                }
                var result = {};
                for(var key in labels) {
                    result[key] = {
                        enable: ((setting === null) ? true : setting[key]),
                        label: labels[key]
                    };
                }
                res.ok({settings: result});
            })
        }
    );
};