/**
 * Created by daisy on 14-6-5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tip = Schema({
    author: Schema.Types.ObjectId,//User:作者
    content: String,//内容
    time: Date,//时间
    isValid: {type: Boolean, default: true},
    likers: [{type: Schema.Types.ObjectId}],//只记录User ID不引用
    comments: [{//评论者
        commenter: {type: Schema.Types.ObjectId},//User:评论者
        time: Date,
        content: String
    }]
});
module.exports = mongoose.model('Tip', Tip);