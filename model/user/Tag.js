/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Tag = Schema({
    tags: [{type: String, lowercase: true, trim: true}],
    tagCount: {type: Number, default: 0}
});

module.exports = mongoose.model('UserTag', Tag);