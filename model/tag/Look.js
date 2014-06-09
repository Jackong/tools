/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Look = Schema({
    _id: {type: String, lowercase: true, trim: true},
    looks: [{type: String}]
});

module.exports = mongoose.model('TagLook', Look);