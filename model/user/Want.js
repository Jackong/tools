/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var Want = Schema({
    wants: [{type: String}]
});

Want.static('sync', function (publisher, lookId) {
    this.update(
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
        }
    ).exec();
});

module.exports = mongoose.model('UserWant', Want);