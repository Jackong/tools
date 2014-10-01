/**
 * Created by daisy on 14-6-1.
 */
var crypto = require('crypto');
var system = require('./config')('system');
var msgConfig = require('../common/config')('message');
var fs = require('fs');

exports.getFileHash = function (filename, algorithm, callback) {
    var shasum = crypto.createHash(algorithm);

    var stream = fs.ReadStream(filename);
    stream.on('data', function(d) {
        shasum.update(d);
    });

    stream.on('end', function() {
        callback(null, shasum.digest('hex'));
    });
};

exports.date = function () {
    return new Date();
};

exports.time = function () {
    return new Date().getTime();
};

exports.now = function () {
    return Date.now();
};

exports.md5 = function (str, salt) {
    if (salt) {
        salt = '';
    } else {
        salt += '-';
    }
    return crypto.createHash('md5').update(salt + str).digest('hex');
};

exports.encrypt = function (data) {
    var cipher = crypto.createCipher('aes-256-cbc', system.salt);
    var crypted = cipher.update(data, 'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (crypted) {
    var decipher = crypto.createDecipher('aes-256-cbc', system.salt);
    var dec = decipher.update(crypted, 'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.modelMethods = function (methodObj, methods) {
    for(var method in methods) {
        methodObj[method] = methods[method];
    }
};
