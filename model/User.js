/**
 * Created by daisy on 14-6-4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var User = Schema(
    {
        _id: {type: String},
        nick: String,
        avatar: String,
        sex: {type: Boolean, default: null},//true:男，false:女
        birthday: {type: Number, default: Date.now },
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

User.static('createOrUpdate', function (uid, obj, callback) {
    obj['_id'] = uid;
    this.update(
        {
            _id: uid
        },
        obj,
        {
            upsert: true
        },
        callback
    );
});

module.exports = mongoose.model('User', User);
