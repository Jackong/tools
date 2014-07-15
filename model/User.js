/**
 * Created by daisy on 14-6-4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var USER_PLATFORM = require('../common/const').USER_PLATFORM;

var User = Schema(
    {
        _id: {type: String},//'platform|account'
        account: {type: String, lowercase: true, trim: true},
        password: String,
        platform: {type: Number, default: USER_PLATFORM.EMAIL},
        nick: String,
        avatar: String,
        sex: {type: Boolean, default: true},
        birthday: Date,
        city: String,
        webSite: String,
        intro: String,
        points: {type: Number, default: 0},
        isValid: {type: Boolean, default: true},
        created: {type: Number, default: Date.now },
        updated: {type: Number, default: Date.now }
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

User.static('perfect', function (uids, callback) {
    if (uids.length <= 0) {
        return callback(null, []);
    }
    this.find(
        {
            _id: {
                $in: uids
            },
            isValid: true
        },
        {
            nick: 1,
            avatar: 1
        },
        {
            lean: true
        },
        function (err, users) {
            if (err || users.length <= 0) {
                return callback(null, []);
            }
            var userMap = {};
            async.each(users, function (user, callback) {
                userMap[user._id] = user;
                callback();
            }, function (err) {
                callback(err, userMap);
            });
        }
    );
});

User.static('getOne', function (uid, callback) {
    this.findOne(
        {
            _id: uid,
            isValid: true
        },
        {
            nick: 1,
            avatar: 1
        },
        {
            lean: true
        },
        callback
    );
});

module.exports = mongoose.model('User', User);
