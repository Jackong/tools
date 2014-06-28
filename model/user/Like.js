/**
 * Created by daisy on 14-6-28.
 */
var mongoose = require('mongoose');
var UserLike = require('./Look');

module.exports = mongoose.model('UserTip', UserLike);