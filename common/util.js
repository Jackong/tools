/**
 * Created by daisy on 14-6-1.
 */
var crypto = require('crypto');

exports.date = function () {
    return new Date();
};

exports.time = function () {
    return new Date().getTime();
};

exports.md5 = function (str, salt) {
    if (salt) {
        salt = '';
    } else {
        salt += '-';
    }
    return crypto.createHash('md5').update(salt + str).digest('hex');
};