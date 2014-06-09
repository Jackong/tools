/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var util = require('../../common/util');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Publication = Schema({
    publications: [{type: String}]
});

util.modelMethods(Publication.statics, {
    publish: function (uid, tags, description) {

    }
});
module.exports = mongoose.model('UserPublication', Publication);