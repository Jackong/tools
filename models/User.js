/**
 * Created by daisy on 14-9-30.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = Schema(
    {
        _id: {type: String, lowercase: true, trim: true},
        password: String,
        access: [{
            tag: {type: String, lowercase: true, trim: true},
            token: {type: String, default: ''},
            expired: {type: Number, default: Date.now}
        }],
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
User.static('active', function (user, callback) {
    this.update({
        _id: user._id,
        password: user.password
    }, {
        $push: {
            access: {
                tag: user.tag,
                expired: user.expired
            }
        }
    }, callback);
});

User.static('getOne', function (condition, callback) {
    this.findOne({
            _id: condition._id,
            password: condition.password,
            isValid: true
        },
        {
            access: 1
        },
        {
            lean: true
        },
        callback
    );
});

User.static('updateAccess', function (condition, access, callback) {
    this.update({
            _id: condition._id,
            password: condition.password
        },
        {
            access: access
        },
        callback
    );
});

module.exports = mongoose.model('User', User);