/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserNotification = Schema({
    notifications: [
        {
            category: Number,//见User settings
            from: Schema.Types.ObjectId, //主语
            isRead: {type: Boolean, default: false},//已读
            created: {type: Number, default: Date.now },
            updated: {type: Number, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('UserNotification', UserNotification);