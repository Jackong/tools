/**
 * Created by daisy on 14-6-26.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserLook = Schema({
    looks: [{
        category: Number,
        look: String
    }]
});

UserLook.static('putNewLook', function (uid, category, lookId, callback) {
    return this.update(
        {
            _id: uid
        },
        {
            $addToSet:
            {
                looks: {
                    category: category,
                    look: lookId
                }
            }
        },
        {
            upsert: true
        },
        callback
    );
});
module.exports = mongoose.model('UserLook', UserLook);