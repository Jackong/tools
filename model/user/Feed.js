/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserFollower = require('./Follower');
var TagFollower = require('../tag/Follower');

/**
 * user._id as _id
 */
var UserFeed = Schema(
    {
        _id: {type: String, ref: 'User'},
        feeds: [{type: String, ref: 'Look'}]
    },
    {
        shardKey:
        {
            _id: 1
        }
    }
);

UserFeed.static('update4user', function (publisher, lookId) {
    var self = this;
    UserFollower.findById(publisher, function (err, userFollower) {
        if (null !== err || null === userFollower) {
            return;
        }
        var followers = userFollower.followers;
        for(var idx = 0; idx < followers.length; idx++) {
            self.push(followers[idx], lookId).exec();
        }
    });
});

UserFeed.static('update4tags', function (tags, lookId) {
    var self = this;
    for(var idx = 0; idx < tags.length; idx++) {
        TagFollower.findById(tags[idx], function (err, tagFollower) {
            if (null !== err || null === tagFollower) {
                return;
            }
            var followers = tagFollower.followers;
            for (var jdx = 0; jdx < followers.length; jdx++) {
                self.push(followers[jdx], lookId).exec();
            }
        });
    }
});

UserFeed.static('push', function (uid, lookId, callback) {
    return this.update(
        {
            _id: uid
        },
        {
            $addToSet: {
                feeds: lookId
            }
        },
        {
            upsert: true
        },
        callback
    );
});

module.exports = mongoose.model('UserFeed', UserFeed);