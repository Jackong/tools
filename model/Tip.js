/**
 * Created by daisy on 14-6-5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logger = require('../common/logger');

var Tip = Schema(
    {
        author: String,//User:作者
        content: String,//内容
        image: String,//抓取的图片
        price: Number,//抓取的价格
        brand: String,//品牌
        created: {type: Number, default: Date.now },
        updated: {type: Number, default: Date.now },
        isValid: {type: Boolean, default: true},
        likes: [{type: String}],//只记录User ID不引用
        comments: [{//评论
            commenter: {type: String},//User:评论者
            time: {type: Number, default: Date.now},
            content: String
        }]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

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

Tip.static('comment', function (tid, commenter, content, callback) {
    this.findByIdAndUpdate(tid,
        {
            $push: {
                comments: {
                    commenter: commenter,
                    content: content
                }
            }
        },
        callback
    )
});

module.exports = mongoose.model('Tip', Tip);