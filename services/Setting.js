/**
 * Created by daisy on 14-7-25.
 */
var logger = require('../common/logger');
var UserSetting = require('../model/user/Setting');

module.exports = {
    onUserSave: function (user) {
        var setting = new UserSetting({_id: user._id});
        setting.save(function (err, setting) {
            if (err) {
                logger.error('init user setting', err)
            }
        });
    }
};