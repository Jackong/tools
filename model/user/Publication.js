/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var helper = require('../../common/helper');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Publication = Schema({
    publications: [{type: String}]
});

helper.modelMethods(Publication.statics, {
    publish: function (uid, tags, description) {

    }
});
module.exports = mongoose.model('UserPublication', Publication);