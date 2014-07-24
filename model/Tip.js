/**
 * Created by daisy on 14-6-5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logger = require('../common/logger');

var Tip = Schema(
    {
        look: {type: String, ref: 'Look'},
        favorite: {type: String, ref: 'Favorite'},
        author: {type: String, ref: 'User'},//User:作者
        content: String,//内容
        image: String,//抓取的图片
        price: Number,//抓取的价格
        brand: String,//品牌
        created: {type: Number, default: Date.now },
        updated: {type: Number, default: Date.now },
        isValid: {type: Boolean, default: true},
        likes: [{type: String, ref: 'User'}],//只记录User ID不引用
        comments: [{//评论
            commenter: {type: String, ref: 'User'},//User:评论者
            time: {type: Number, default: Date.now},
            content: String
        }]
    },
    {
        shardKey:
        {
            _id: 1,
            look: 1,
            favorite: 1
        }
    }
);

Tip.static('gets', function (tids, lookId, aspect, callback) {
    if (tids.length <= 0) {
        return callback(null, []);
    }
    this.find(
        {
            _id: {
                $in: tids
            },
            look: lookId,
            favorite: aspect,
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

Tip.static('comment', function (tid, lookId, aspect, commenter, content, callback) {
    this.findOneAndUpdate(
        {
            _id: tid,
            look: lookId,
            favorite: aspect,
            isValid: true
        },
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

Tip.static('like', function (tid, lookId, aspect, uid, callback) {
    this.update(
        {
            _id: tid,
            look: lookId,
            favorite: aspect,
            isValid: true
        },
        {
            likes: {
                $addToSet: uid
            }
        },
        callback
    )
});

Tip.static('onTip', function (callback) {
    Tip.post('save', callback);
});

module.exports = mongoose.model('Tip', Tip);