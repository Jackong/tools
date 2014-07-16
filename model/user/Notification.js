/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserNotification = Schema(
    {
        _id: {type: String, ref: 'User'},
        notifications: [
            {
                category: Number,//见User settings
                from: {type: String, ref: 'User'}, //主语
                isRead: {type: Boolean, default: false},//已读
                created: {type: Number, default: Date.now },
                updated: {type: Number, default: Date.now }
            }
        ]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

module.exports = mongoose.model('UserNotification', UserNotification);