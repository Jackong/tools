/**
 * Created by daisy on 14-6-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * user._id as _id
 */
var UserNotification = Schema(
    {
        _id: {type: String, ref: 'User'},
        notifications: [
            {
                from: {type: String, ref: 'User'}, //主语
                action: Number,//见User settings
                look: {type: String, ref: 'Look'},
                isRead: {type: Boolean, default: false},//已读
                created: {type: Number, default: Date.now }
            }
        ]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

UserNotification.static('add', function(from, to, action, look, callback) {
    if (from == to) {
        return callback(null, 0)
    }
	this.update(
		{
			_id: to
		},
		{
			_id: to,
			$push: { 
				notifications: {
					from: from,
					action: action,
					look: look
				}
			}
		},
		{
			upsert: true
		},
		callback
	);
});

UserNotification.static('gets', function(uid, start, num, callback) {
	if (start < 0 || num <= 0) {
		return callback(null, null);
	}
	this.findOne(
		{
			_id: uid
		},
		{
			notifications: 
			{
				$slice: [start, num]
			}
		},
		callback
	);
});

UserNotification.static('read', function (uid, nids, callback) {
    this.update(
        {
            _id: uid,
            'notifications._id': {
		    $in: nids
	    }
        },
        {
            $set: {
                'notifications.$.isRead': true
            }
        },
        callback
    );
});

module.exports = mongoose.model('UserNotification', UserNotification);
