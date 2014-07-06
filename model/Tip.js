/**
 * Created by daisy on 14-6-5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var Tip = Schema({
    author: Schema.Types.ObjectId,//User:作者
    content: String,//内容
    image: String,//抓取的图片
    price: Number,//抓取的价格
    brand: String,//品牌
    created: {type: Number, default: Date.now },
    updated: {type: Number, default: Date.now },
    isValid: {type: Boolean, default: true},
    likes: [{type: Schema.Types.ObjectId}],//只记录User ID不引用
    comments: [{//评论
        commenter: {type: Schema.Types.ObjectId},//User:评论者
        time: Date,
        content: String
    }]
});

Tip.static('gets', function (tids, callback) {
    if (tids.length <= 0) {
        return callback(null, []);
    }
    this.find(
        {
            _id: {
                $in: tids
            },
            isValid: true
        },
        {
            author: 1,
            content: 1,
            price: 1,
            created: 1,
            comments: 1
        },
        {
            lean: true
        },
        callback
    );
});

module.exports = mongoose.model('Tip', Tip);