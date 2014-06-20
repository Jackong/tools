/**
 * Created by daisy on 14-6-9.
 */

require('../../common/mongo');
var should = require('should');
var mongoose = require('mongoose');
var Look = require('../../model/Look');
var TagLook = require('../../model/tag/Look');
var TagFollower = require('../../model/tag/Follower');
var UserPublication = require('../../model/user/Publication');
var UserWant = require('../../model/user/Want');
var UserFollower = require('../../model/user/Follower');
var UserFeed = require('../../model/user/Feed');
var User = require('../../model/User');
var LookService = require('../../services/Look');


var emptyFeedUid = new mongoose.Types.ObjectId;
var hasFeedUid = new mongoose.Types.ObjectId;
var filterFeedUid = new mongoose.Types.ObjectId;

var publisher = new mongoose.Types.ObjectId;
var notExistLookId = 'notExistLookId';
var lookId = 'theHashOfTheFile';
var image = 'image';
var tags = ['fashion', 'dress'];
var newTag = 'daisy';

var description = 'desc';
var aspect1 = 'shirt';
var aspect2 = 'dress';
var account = 'jackongc@gmail.com';

describe('LookService', function () {
    describe.skip('.feeds()', function () {
        before(function () {
            var tagFollower = new TagFollower({_id: tags[0], followers: [hasFeedUid]});
            tagFollower.save(function (err) {
                should.not.exist(err);
            });

            var user = new User({_id: publisher, account: account});
            user.save(function (err) {
                should.not.exist(err);
            });

            LookService.publish(lookId, publisher, image, tags, aspect1, description, function (err, doc) {
                should.not.exist(err);
            });

            UserFeed.push(filterFeedUid, notExistLookId).exec();

        });
        it('should be return empty when my following did not published anything', function (done) {
            LookService.getFeeds(emptyFeedUid, 0, 1, function (err, feeds) {
                should.exist(err);
                done();
            });
        });
        it('should be return not empty when my following published something', function (done) {
            LookService.getFeeds(hasFeedUid, 0, 1, function (err, feeds) {
                should.not.exist(err);
                feeds.should.with.lengthOf(1);
                feeds[0].publisher.should.be.an.Object.and.have.property('_id', publisher);
                done();
            });
        });
        it('should be filter when the look is not exist', function (done) {
            LookService.getFeeds(filterFeedUid, 0, 1, function (err, feeds) {
                should.not.exist(err);
                feeds.should.with.lengthOf(0);
                done();
            });
        });

        after(function () {
            Look.remove({_id: lookId}).exec();
            UserFeed.remove({_id: filterFeedUid}).exec();
            TagFollower.remove({_id: tags[0]}).exec();
            User.remove({account: account}).exec();
        })
    });

    describe('.publish()', function () {

        var tagFollowerId1 = new mongoose.Types.ObjectId;
        var userFollowerId1 = new mongoose.Types.ObjectId;
        var tagAndUserFollowerId = new mongoose.Types.ObjectId;

        var publish = function (callback) {
            LookService.publish(lookId, publisher, image, tags, aspect1, description, callback);
        };
        beforeEach(function () {

/*            tagFollowerId1.should.not.eql(userFollowerId1);
            userFollowerId1.should.not.eql(tagAndUserFollowerId);

            var tagFollower = new TagFollower({_id: tags[0], followers: [tagFollowerId1, tagAndUserFollowerId]});
            tagFollower.save(function (err) {
                should.not.exist(err);
            });

            var userFollower = new UserFollower({_id: publisher, followers: [userFollowerId1, tagAndUserFollowerId]});

            userFollower.save(function (err) {
                should.not.exist(err);
            });*/
        });

        it('should sync tags looks', function (done) {
            publish(function (err, doc) {
                TagLook.count({
                    _id: {
                        $in: doc.tags
                    },
                    looks: {
                        $all: [doc._id]
                    }
                }, function (err, count) {
                    count.should.be.exactly(2);
                    done();
                });
            });
        });


        it('should sync publications for the user', function (done) {
            publish(function(err, doc) {
                UserPublication.count({
                    _id: doc.publisher,
                    publications: {
                        $all: [doc._id]
                    }
                }, function (err, count) {
                    count.should.be.exactly(1);
                    done();
                });
            });
        });

        it('should sync wants for the user', function (done) {
            publish(function (err, doc) {
                UserWant.count({
                    _id: doc.publisher,
                    wants: {
                        $all: [doc._id]
                    }
                }, function (err, count) {
                    count.should.be.exactly(1);
                    done();
                });
            });
        });

        it.skip('should sync feeds for the followers of the tags', function (done) {
            publish(function (err, doc) {
                setTimeout(function () {
                    UserFeed.count({
                        _id: tagFollowerId1,
                        feeds: {
                            $all: [doc._id]
                        }
                    }, function (err, count) {
                        count.should.be.exactly(1);
                        done();
                    });
                }, 10);
            });
        });

        it.skip('should sync feeds for the followers of the publisher', function (done) {
            publish(function (err, doc) {
                setTimeout(function () {
                    UserFeed.count({
                        _id: userFollowerId1,
                        feeds: {
                            $all: [doc._id]
                        }
                    }, function (err, count) {
                        count.should.be.exactly(1);
                        done();
                    });
                }, 10);
            });
        });

        it.skip('should sync feeds without duplication for the followers of the tags and the publisher', function (done) {
            publish(function (err, doc) {
                setTimeout(function () {
                    UserFeed.count({
                        _id: tagAndUserFollowerId,
                        feeds: {
                            $size: 1
                        }
                    }, function (err, count) {
                        count.should.be.exactly(1);
                        done();
                    });
                }, 10);
            });
        });

        afterEach(function () {
            Look.remove({_id: lookId}).exec();
            TagLook.remove({_id: {$in: tags}}).exec();
            UserPublication.remove({_id: publisher}).exec();
/*            UserWant.remove({_id: publisher}).exec();
            UserFeed.remove({_id: userFollowerId1}).exec();
            UserFeed.remove({_id: tagFollowerId1}).exec();
            UserFeed.remove({_id: tagAndUserFollowerId}).exec();
            TagFollower.remove({_id: tags[0]}).exec();
            UserFollower.remove({_id: publisher}).exec();*/
        });
    });

    describe('.republish()', function () {
        var publisher2 = new mongoose.Types.ObjectId;
        var tagFollowerId2 = new mongoose.Types.ObjectId;
        var userFollowerId2 = new mongoose.Types.ObjectId;
        var favorite1 = null;
        var favorite2 = null;
        var look = null;
        var existLookDoc = null;
        beforeEach(function () {
            favorite1 = {
                _id: aspect1,
                wants:[publisher],
                wantCount: 1
            };
            favorite2 = {
                _id: aspect2,
                wants:[publisher],
                wantCount: 1
            };
            look = new Look({
                _id: lookId,
                publisher: publisher,
                image: image,
                tags: tags,
                description: description,
                favorites: [favorite1]
            });

            existLookDoc = {
                _id: lookId,
                publisher: publisher,
                image: image,
                tags: tags,
                favorites: [favorite1]
            };
/*            var newTagFollower = new TagFollower({_id: newTag, followers: [tagFollowerId2]});
            newTagFollower.save(function (err) {
                should.not.exist(err);
            });

            var newUserFollower = new UserFollower({_id: publisher2, followers: [userFollowerId2]});
            newUserFollower.save(function (err) {
                should.not.exist(err);
            });*/
        });

        it('should not change the publisher when the look has been published by other one', function (done) {
            look.publisher = publisher2;
            LookService.republish(existLookDoc, look, function (err, doc) {
                doc.publisher.should.not.equal(publisher2);
                done();
            });
        });

        it('should not new a publication when the look has been published by other one', function (done) {
            look.publisher = publisher2;
            LookService.republish(existLookDoc, look, function (err, doc) {
                UserPublication.count({
                    _id: publisher2,
                    publications: {
                        $all: [doc._id]
                    }
                }, function (err, count) {
                    count.should.be.exactly(0);
                    done();
                });
            });
        });

        it('should append different tags when the look has been published with other tags', function (done) {
            look.tags.push(newTag);
            LookService.republish(existLookDoc, look, function (err, doc) {
                doc.tags.should.containEql(newTag);
                done();
            });
        });

        it('should append to the wants when the look has been published by other one', function (done) {
            look.publisher = publisher2;
            LookService.republish(existLookDoc, look, function (err, doc) {
                UserWant.count({
                    _id: publisher2,
                    wants: {
                        $all: [doc._id]
                    }
                }, function (err, count) {
                    count.should.be.exactly(1);
                    done();
                });
            });
        });

        it('should append different favorite when the look has been published with other favorite', function (done) {
            look.favorites = [favorite2];
            LookService.republish(existLookDoc, look, function (err, doc) {
                doc.favorites.should.containEql(favorite1, favorite2);
                done();
            });
        });

        it('should not append different favorite when the look has been published with an exist favorite', function (done) {
            LookService.republish(existLookDoc, look, function (err, doc) {
                doc.favorites.should.be.eql([favorite1]);
                done();
            });
        });

        it.skip('should add new feed for the followers of new publisher(want)', function (done) {
            look.publisher = publisher2;
            LookService.republish(existLookDoc, look, function (err, doc) {
                UserFeed.count({
                    _id: userFollowerId2,
                    feeds: {
                        $all: [doc._id]
                    }
                }, function (err, count) {
                    count.should.be.exactly(1);
                    done();
                });
            });
        });

        it.skip('should add new feed for the followers of new tags', function (done) {
            look.tags.push(newTag);
            LookService.republish(existLookDoc, look, function (err, doc) {
                setTimeout(function () {
                    UserFeed.count({
                        _id: tagFollowerId2,
                        feeds: {
                            $all: [doc._id]
                        }
                    }, function (err, count) {
                        count.should.be.exactly(1);
                        done();
                    });
                },100)
            });
        });

        afterEach(function () {
            Look.remove({_id: lookId}).exec();
            TagLook.remove({_id: {$in: [newTag]}}).exec();
            UserWant.remove({_id: publisher2}).exec();
/*            UserFeed.remove({_id: tagFollowerId2}).exec();
            UserFeed.remove({_id: userFollowerId2}).exec();
            TagFollower.remove({_id: newTag}).exec();
            UserFollower.remove({_id: publisher2}).exec();*/
        })
    })
});