/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = Schema({
    _id: {type: String, lowercase: true, trim: true},//标签名
    icon: String,//图标
    isValid: {type: Boolean, default: true},
    looks: [{type: String}],//Look:样子
    followers: [{type: Schema.Types.ObjectId}]//User:关注者
});
module.exports = mongoose.model('Tag', Tag);