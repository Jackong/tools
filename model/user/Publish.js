/**
 * Created by daisy on 14-6-28.
 */
var mongoose = require('mongoose');
var UserPublish = require('./Look');

module.exports = mongoose.model('UserPublish', UserPublish);