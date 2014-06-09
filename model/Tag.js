/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = Schema({
    _id: {type: String, lowercase: true, trim: true},//标签名
    icon: String,//图标
    isValid: {type: Boolean, default: true}
});
module.exports = mongoose.model('Tag', Tag);