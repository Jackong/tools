/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Favorite = Schema({
    aspect: String,
    isValid: {type: Boolean, default: true},
    wants: [{ type: Schema.Types.ObjectId }],//User:想要的人
    tips: [{type: Schema.Types.ObjectId}]//Tip:提示信息
});
module.exports = mongoose.model('Favorite', Favorite);