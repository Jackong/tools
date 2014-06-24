/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserWant = Schema({
    wants: [{type: String}]
});

UserWant.static('putNewLook', function (publisher, lookId, callback) {
    return this.update(
        {
            _id: publisher
        },
        {
            $addToSet:
            {
                wants: lookId
            }
        },
        {
            upsert: true
        },
        callback
    );
});

module.exports = mongoose.model('UserWant', UserWant);