/**
 * Created by daisy on 14-6-9.
 */

require('../../../common/mongo');
var should = require('should');
var mongoose = require('mongoose');
var UserFeed = require('../../../model/user/Feed');
var TagFollower = require('../../../model/tag/Follower');
var Look = require('../../../model/Look');
var User = require('../../../model/User');


var emptyFeedUid = new mongoose.Types.ObjectId;
var hasFeedUid = new mongoose.Types.ObjectId;
var filterFeedUid = new mongoose.Types.ObjectId;

var publisher = new mongoose.Types.ObjectId;
var notExistLookId = 'notExistLookId';
var lookId = 'theHashOfTheFile';
var image = 'image';
var tags = ['fashion'];
var description = 'desc';
var favorite = lookId + '-' + 'shirt';
var account = 'jackongc@gmail.com';

describe('UserFeed', function () {
    before(function () {
        var tagFollower = new TagFollower({_id: tags[0], followers: [hasFeedUid]});
        tagFollower.save(function (err) {
            should.not.exist(err);
        });

        var user = new User({_id: publisher, account: account});
        user.save(function (err) {
            should.not.exist(err);
        });

        var look = new Look({
            _id: lookId,
            publisher: publisher,
            image: image,
            tags: tags,
            description: description,
            favorites: [favorite]
        });

        look.publish(function (err, doc) {
            should.not.exist(err);
        });

        UserFeed.push(filterFeedUid, notExistLookId).exec();

    });
    describe('#feeds', function () {
        it('should be return empty when my following did not published anything', function (done) {
            Look.feeds(emptyFeedUid, 0, 1, function (err, feeds) {
                should.exist(err);
                done();
            });
        });
        it('should be return not empty when my following published something', function (done) {
            Look.feeds(hasFeedUid, 0, 1, function (err, feeds) {
                should.not.exist(err);
                feeds.should.with.lengthOf(1);
                feeds[0].publisher.should.be.an.Object.and.have.property('_id', publisher);
                done();
            });
        });
        it('should be filter when the look is not exist', function (done) {
            Look.feeds(filterFeedUid, 0, 1, function (err, feeds) {
                should.exist(err);
                done();
            });
        });
    });

    after(function () {
        Look.remove({_id: lookId}).exec();
        UserFeed.remove({_id: filterFeedUid}).exec();
        TagFollower.remove({_id: tags[0]}).exec();
        User.remove({account: account}).exec();
    })
});