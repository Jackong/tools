/**
 * Created by daisy on 14-5-30.
 */
var Auth = require('../model/Auth');
var date = require('../common/util').date;

module.exports = {
    create: function (account, password, cb) {
        var auth = new Auth({ account: account, password: password, time: date()});
        auth.save(cb);
    },
    updatePassword: function (account, password, cb) {
        Auth.update({account: account}, {password: password}, cb);
    },
    del: function (account, cb) {
        Auth.remove({account: account}, cb);
    },
    get: function (account, cb) {
        Auth.findOne({account: account}, cb);
    }
};