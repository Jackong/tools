/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserTag = Schema({
    tags: [{type: String, lowercase: true, trim: true}]
});

module.exports = mongoose.model('UserTag', UserTag);