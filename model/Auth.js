/**
 * Created by daisy on 14-5-31.
 */
var mongoose = require('mongoose');
module.exports = mongoose.model('Auth', {
    account: {type: 'string', unique: true},
    password: String,
    time: Date
});