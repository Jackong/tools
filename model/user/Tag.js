/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Tag = Schema({
    ids: [{type: String, lowercase: true, trim: true}]
});

module.exports = mongoose.model('UserTag', Tag);