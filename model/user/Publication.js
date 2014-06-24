/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserPublication = Schema({
    publications: [{type: String}]
});

UserPublication.static('putNewLook', function (publisher, lookId, callback) {
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
module.exports = mongoose.model('UserPublication', UserPublication);