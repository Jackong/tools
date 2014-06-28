/**
 * Created by daisy on 14-6-28.
 */
var mongoose = require('mongoose');
var UserTip = require('./Look');

module.exports = mongoose.model('UserTip', UserTip);