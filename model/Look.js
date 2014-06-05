/**
 * Created by daisy on 14-6-4.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Look = Schema({
    _id: String,//文件MD5
    publisher: Schema.Types.ObjectId,//User:发布者
    image: String,//图片
    isValid: {type: Boolean, default: true},
    tags: [{type: String, lowercase: true, trim: true}],//标签
    description: String,//描述
    likers: [{ type: Schema.Types.ObjectId }],//User:喜欢的人
    favorites: [{type: Schema.Types.ObjectId}]//Favorite:心仪的东西
});

module.exports = mongoose.model('Look', Look);