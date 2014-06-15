/**
 * Created by daisy on 14-6-9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserFollower = require('./Follower');
var TagFollower = require('../tag/Follower');
var Look = require('../Look');

/**
 * user._id as _id
 */
var Feed = Schema({
    feeds: [{type: String}]
});

Feed.static('update4user', function (publisher, lookId) {
    var self = this;
    UserFollower.findById(publisher, function (err, userFollower) {
        if (null !== err || null === userFollower) {
            return;
        }
        var followers = userFollower.followers;
        for(var idx = 0; idx < followers.length; idx++) {
            self.update(
                {
                    _id: followers[idx]
                },
                {
                    $addToSet: {
                        feeds: lookId
                    }
                },
                {
                    upsert: true
                }
            ).exec();
        }
    });
});

Feed.static('update4tags', function (tags, lookId) {
    var self = this;
    for(var idx = 0; idx < tags.length; idx++) {
        TagFollower.findById(tags[idx], function (err, tagFollower) {
            if (null !== err || null === tagFollower) {
                return;
            }
            var followers = tagFollower.followers;
            for (var jdx = 0; jdx < followers.length; jdx++) {
                self.update(
                    {
                        _id: followers[jdx]
                    },
                    {
                        $addToSet: {
                            feeds: lookId
                        }
                    },
                    {
                        upsert: true
                    }
                ).exec();
            }
        });
    }
});

Feed.static('gets', function (uid, callback) {
    this.findById(uid, function (err, feed) {
        callback(err, feed);
    })
});

module.exports = mongoose.model('UserFeed', Feed);