/**
 * Created by daisy on 14-6-28.
 */
var mongoose = require('mongoose');
var UserWant = require('./Look');

module.exports = mongoose.model('UserWant', UserWant);