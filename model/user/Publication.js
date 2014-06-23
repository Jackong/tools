/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Publication = Schema({
    publications: [{type: String}],
    publicationCount: {type: Number, default: 0}
});

Publication.static('putNewLook', function (publisher, lookId, callback) {
    return this.update(
        {
            _id: publisher
        },
        {
            $addToSet:
            {
                publications: lookId
            }
        },
        {
            upsert: true
        },
        callback
    );
});
module.exports = mongoose.model('UserPublication', Publication);