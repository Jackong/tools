/**
 * Created by daisy on 14-6-26.
 */
var mongoose = require('mongoose');
/**
 * user._id as _id
 */
var UserLook = mongoose.Schema({
    looks: [{
        type: String
    }]
});

UserLook.static('putNewLook', function (uid, lookId, callback) {
    return this.update(
        {
            _id: uid
        },
        {
            $addToSet:
            {
                looks: lookId
            }
        },
        {
            upsert: true
        },
        callback
    );
});

UserLook.static('gets', function (uid, start, num, callback) {
    if (start < 0 || num <= 0) {
        return callback(null, null);
    }
    this.findOne(
        {
            _id: uid
        },
        {
            looks: {
                $slice: [start, num]
            }
        },
        callback
    );
});

module.exports = UserLook;