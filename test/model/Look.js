/**
 * Created by daisy on 14-6-5.
 */
require('../../common/mongo');
var mongoose = require('mongoose');
var should = require("should");
var Look = require('../../model/Look');
var Favorite = require('../../model/Favorite');
var TagLook = require('../../model/tag/Look');
var TagFollower = require('../../model/tag/Follower');
var UserPublication = require('../../model/user/Publication');
var UserWant = require('../../model/user/Want');
var UserFollower = require('../../model/user/Follower');
var UserFeed = require('../../model/user/Feed');

var look = null;
var id = 'md5-the-image-file';
var publisher = new mongoose.Types.ObjectId;
var tagFollowerId = new mongoose.Types.ObjectId;
var userFollowerId = new mongoose.Types.ObjectId;
var tagAndUserFollowerId = new mongoose.Types.ObjectId;
var image = 'image file';
var tags = ['fashion', 'dress'];
var description = 'description';
var aspect = 'shirt';

describe('Look', function () {
    beforeEach(function () {
        look = new Look({
            _id: id,
            publisher: publisher,
            image: image,
            tags: tags,
            description: description,
            favorites:[],
            aspect: aspect
        });

        tagFollowerId.should.not.eql(userFollowerId);
        userFollowerId.should.not.eql(tagAndUserFollowerId);

        var tagFollower = new TagFollower({_id: tags[0], followers: [tagFollowerId, tagAndUserFollowerId]});
        tagFollower.save(function (err) {
            should.not.exist(err);
        });

        var userFollower = new UserFollower({_id: publisher, followers: [userFollowerId, tagAndUserFollowerId]});
        userFollower.save(function (err) {
            should.not.exist(err);
        });
    });

    describe('.save()', function () {
        it('should save favorites', function (done) {
            look.save(function (err, doc) {
                doc.favorites.should.have.lengthOf(1);
                Favorite.count({_id: doc.favorites[0]}, function (err, count) {
                    count.should.be.exactly(1);
                    done();
                });
            });
        });

        it('should sync tags looks', function (done) {
            look.save(function (err, doc) {
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
            look.save(function(err, doc) {
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
            look.save(function (err, doc) {
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

        it('should sync feeds for the followers of the tags', function (done) {
            look.save(function (err, doc) {
                setTimeout(function () {
                    UserFeed.count({
                        _id: tagFollowerId,
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

        it('should sync feeds for the followers of the publisher', function (done) {
            look.save(function (err, doc) {
                setTimeout(function () {
                    UserFeed.count({
                        _id: userFollowerId,
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

        it('should sync feeds without duplication for the followers of the tags and the publisher', function (done) {
            look.save(function (err, doc) {
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
    });

    afterEach(function () {
        Look.remove({_id: id}).exec();
        Favorite.remove({aspect: aspect}).exec();
        TagLook.remove({_id: {$in: tags}}).exec();
        UserPublication.remove({_id: publisher}).exec();
        UserWant.remove({_id: publisher}).exec();
        UserFeed.remove({_id: userFollowerId}).exec();
        UserFeed.remove({_id: tagFollowerId}).exec();
        UserFeed.remove({_id: tagAndUserFollowerId}).exec();
        TagFollower.remove({_id: tags[0]}).exec();
        UserFollower.remove({_id: publisher}).exec();
    });
});