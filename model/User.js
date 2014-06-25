/**
 * Created by daisy on 14-6-4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = Schema({
    account: {type: String, unique: true, lowercase: true, trim: true},
    password: String,
    nick: String,
    avatar: String,
    sex: {type: Boolean, default: true},
    birthday: Date,
    city: String,
    webSite: String,
    intro: String,
    points: {type: Number, default: 0},
    isValid: {type: Boolean, default: true},
    time: {type: Date, default: Date.now }
});


module.exports = mongoose.model('User', User);
