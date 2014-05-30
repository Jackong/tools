/**
 * Created by daisy on 14-5-30.
 */

var account = {
    save: function (account, password) {
        return true;
    },
    updatePassword: function (account, password) {
        return true;
    },
    del: function (account) {
        return true;
    },
    get: function (account) {
        return null;
    }
};
module.exports = account;