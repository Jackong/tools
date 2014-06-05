/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = Schema({
    type: Number,
    time: {type: Date, default: Date.now},
    who: Schema.Types.ObjectId, //主语
    isRead: {type: Boolean, default: false}//已读
});

module.exports = mongoose.model('Notification', Notification);