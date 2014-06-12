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
var id = 'md5theimagefile';
var publisher = new mongoose.Types.ObjectId;
var publisher2 = new mongoose.Types.ObjectId;
var tagFollowerId = new mongoose.Types.ObjectId;
var userFollowerId = new mongoose.Types.ObjectId;
var tagAndUserFollowerId = new mongoose.Types.ObjectId;
var image = 'image file';
var tags = ['fashion', 'dress'];
var newTag = 'daisy';
var description = 'description';
var aspect = 'shirt';
var aspect2 = 'dress';

var favorite1 = id + '-' + aspect;
var favorite2 = id + '-' + aspect2;

describe('Look', function () {
    beforeEach(function () {
        look = new Look({
            _id: id,
            publisher: publisher,
            image: image,
            tags: tags,
            description: description,
            favorites: [favorite1]
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

    describe('.publish()', function () {
        it('should save favorites', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                doc.favorites.should.have.lengthOf(1);
                setTimeout(function () {
                    Favorite.findById(doc.favorites[0], function (err, favorite) {
                        should.not.exist(err);
                        favorite.should.be.an.object;
                        favorite.aspect.should.be.equal(aspect);
                        done();
                    });
                },10);
            });
        });

        it('should sync tags looks', function (done) {
            look.publish(function (err, doc) {
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
            look.publish(function(err, doc) {
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
            look.publish(function (err, doc) {
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
            look.publish(function (err, doc) {
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
            look.publish(function (err, doc) {
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
            look.publish(function (err, doc) {
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

        it.skip('should not change the publisher when the look has been published by other one', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                look.publisher = publisher2;
                look.publish(function (err, doc) {
                    doc.publisher.should.not.equal(publisher2);
                    done();
                });
            });
        });

        it.skip('should not new a publication when the look has been published by other one', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                look.publisher = publisher2;
                look.publish(function (err, doc) {
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
        });

        it.skip('should append different tags when the look has been published', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                look.tags.push(newTag);
                look.publish(function (err, doc) {
                    doc.tags.should.containEql(newTag);
                    done();
                });
            });
        });

        it.skip('should append to the wants when the look has been published by other one', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                look.publisher = publisher2;
                look.publish(function (err, doc) {
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
        });

        it.skip('should append different favorite when the look has been published with other favorite', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                look.favorites = [favorite2];
                look.publish(function (err, doc) {
                    doc.favorites.should.containEql(favorite1, favorite2);
                    Favorite.findById(favorite2, function (err, favorite) {
                        should.not.exist(err);
                        favorite.should.be.an.object;
                        favorite.aspect.should.be.equal(aspect);
                        done();
                    });
                });
            });
        });

        it.skip('should not append different favorite when the look has been published with an exist favorite', function (done) {
            look.publish(function (err, doc) {
                should.not.exist(err);
                look.publish(function (err, doc) {
                    doc.favorites.should.be.eql([favorite1]);
                    done();
                });
            });
        });
    });

    afterEach(function () {
        Look.remove({_id: id}).exec();
        Favorite.remove({_id: favorite1}).exec();
        Favorite.remove({_id: favorite2}).exec();
        TagLook.remove({_id: {$in: tags}}).exec();
        UserPublication.remove({_id: publisher}).exec();
        UserWant.remove({_id: publisher}).exec();
        UserWant.remove({_id: publisher2}).exec();
        UserFeed.remove({_id: userFollowerId}).exec();
        UserFeed.remove({_id: tagFollowerId}).exec();
        UserFeed.remove({_id: tagAndUserFollowerId}).exec();
        TagFollower.remove({_id: tags[0]}).exec();
        UserFollower.remove({_id: publisher}).exec();
    });
});