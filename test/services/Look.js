/**
 * Created by daisy on 14-6-21.
 */
var should = require('should');
var sinon = require('sinon');
var mongoose = require('mongoose');
var async = require('async');

require('../../common/mongo');

var Look = require('../../model/Look');
var Tag = require('../../model/Tag');
var UserPublish = require('../../model/user/Publish');
var UserWant = require('../../model/user/Want');
var UserLike = require('../../model/user/Like');
var User = require('../../model/User');
var Tip = require('../../model/Tip');
var Favorite = require('../../model/Favorite');

var LookService = require('../../services/Look');
var FavoriteService = require('../../services/Favorite');

sinon.config = {
    useFakeTimers: false,
    useFakeServer: false
};

describe('Look', function () {
    var look = null;
    beforeEach(function () {
        var publisher = 'publisherId';
        look = new Look(
            {
               	_id: 'look-id',
                publisher: publisher,
                image: 'image',
                tags: ['nice', 'dress'],
                description: 'desc',
                favorites: [
                    'shirt'
                ]
            }
        );
    });
    describe('.firstPublish()', function () {
        it('should be saved and put to tags, publication and want', sinon.test(function (done) {
            var save = this.stub(look, 'save');
            this.stub(Tag, 'putNewLook');
            this.stub(UserPublish, 'putNewLook');
            this.stub(UserWant, 'putNewLook');
            this.stub(Favorite, 'sync');
            LookService.firstPublish(look, function (err, doc) {
                should.not.exist(err);
                should.exist(doc);
                Tag.putNewLook.called.should.be.true;
                UserPublish.putNewLook.called.should.be.true;
                UserWant.putNewLook.called.should.be.true;
                Favorite.sync.called.should.be.true;
                done();
            });
            save.yield(null, null);
            Tag.putNewLook.yield(null);
            UserPublish.putNewLook.yield(null, null);
            UserWant.putNewLook.yield(null, null);
            Favorite.sync.yield(null, new Favorite({look: look._id, aspect: look.favorites[0], wants:[], tips:[]}), 0);
        }));
    });

    describe('.republish()', function () {
        var old = null;
        var publisher = new mongoose.Types.ObjectId;
        beforeEach(function () {
            old = new Look(
                {
                    _id: new mongoose.Types.ObjectId,
                    publisher: publisher,
                    image: 'image',
                    tags: ['nice'],
                    description: 'desc',
                    favorites: [
                        'glasses'
                    ]
                }
            );
        });
        it('should update favorites, tags and want when they are different', sinon.test(function (done) {
            this.stub(Look, 'appendTagsAndFavorites');
            this.stub(Tag, 'putNewLook');
            this.stub(UserWant, 'putNewLook');
            this.stub(Favorite, 'sync');
            LookService.republish(old, look, function (err, doc) {
                Tag.putNewLook.called.should.be.true;
                Favorite.sync.called.should.be.true;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(2);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            UserWant.putNewLook.yield(null, null);
            Look.appendTagsAndFavorites.yield(null, 1);
        }));

        it('should update favorites only when tags are not different', sinon.test(function (done) {
            this.stub(Look, 'appendTagsAndFavorites');
            this.stub(Tag, 'putNewLook');
            this.stub(UserWant, 'putNewLook');
            this.stub(Favorite, 'sync');
            look.tags = old.tags;
            LookService.republish(old, look, function (err, doc) {
                Tag.putNewLook.called.should.be.false;
                Favorite.sync.called.should.be.true;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(1);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            UserWant.putNewLook.yield(null, null);
            Look.appendTagsAndFavorites.yield(null, 1);
        }));

        it('should not update when tags and favorites are not different', sinon.test(function (done) {
            this.stub(Tag, 'putNewLook');
            this.stub(UserWant, 'putNewLook');
            this.stub(Favorite, 'sync');
            look.tags = old.tags;
            look.favorites[0] = old.favorites[0];
            LookService.republish(old, look, function (err, doc) {
                Tag.putNewLook.called.should.be.false;
                Favorite.sync.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(1);
                doc.favorites.should.with.lengthOf(1);
                done();
            });

            UserWant.putNewLook.yield(null, null);
        }));

        it('should not put new look to want when the publisher is the same', sinon.test(function (done) {
            this.stub(Look, 'appendTagsAndFavorites');
            this.stub(Tag, 'putNewLook');
            this.stub(UserWant, 'putNewLook');
            this.stub(Favorite, 'sync');
            look.publisher = old.publisher;
            LookService.republish(old, look, function (err, doc) {
                Tag.putNewLook.called.should.be.true;
                Favorite.sync.called.should.be.true;
                UserWant.putNewLook.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(2);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            Look.appendTagsAndFavorites.yield(null, 1);
        }));
    });

    describe('.getTrend()', function () {
        afterEach(function () {
            Look.getTrend.restore();
            User.perfect.restore();
            Favorite.perfect.restore();
        });
        it('should perfect publishers and favorites info when looks is not empty', function (done) {
            sinon.stub(Look, 'getTrend', function (start, num, callback) {
                callback(null, [look]);
            });
            sinon.stub(User, 'perfect', function (uids, callback) {
                var user = {};
                user[look.publisher] = new User({_id: look.publisher, nick: 'jack', avatar: 'avatar url'});
                callback(null, user);
            });
            sinon.stub(Favorite, 'perfect', function (lookId, aspects, callback) {
                callback(null, [new Favorite({look: lookId, aspect: aspects[0], wants: [], tips: []})]);
            });
            LookService.getTrend(0, 1, function (err, looks) {
                should.not.exist(err);
                looks.should.with.lengthOf(1);
                User.perfect.called.should.be.true;
                Favorite.perfect.called.should.be.true;
                done();
            });
        });

        it('should not perfect publisher and favorites info when looks is empty', function (done) {
            sinon.stub(Look, 'getTrend', function (start, num, callback) {
                callback(null, []);
            });
            sinon.stub(Favorite, 'perfect');
            sinon.stub(User, 'perfect');
            LookService.getTrend(0, 1, function (err, looks) {
                should.not.exist(err);
                looks.should.with.lengthOf(0);
                User.perfect.called.should.be.false;
                Favorite.perfect.called.should.be.false;
                done();
            });
        });

        it('should be filter when the publisher is invalid', function (done) {
            sinon.stub(Look, 'getTrend', function (start, num, callback) {
                callback(null, [look]);
            });
            sinon.stub(User, 'perfect', function (uids, callback) {
                callback(null, []);
            });
            sinon.stub(Favorite, 'perfect', function (lookId, aspects, callback) {
                callback(null, []);
            });
            LookService.getTrend(0, 1, function (err, looks) {
                should.not.exist(err);
                looks.should.with.lengthOf(0);
                User.perfect.called.should.be.true;
                Favorite.perfect.called.should.be.false;
                done();
            });
        });
    });

    describe('.getDetail()', function () {
        var publisherId = null;
        beforeEach(function () {
            publisherId = look.publisher;
            sinon.stub(Look, 'getOne', function (id, callback) {
                if (look._id === id) {
                    return callback(null, look);
                }
                callback(null, null);
            });
            sinon.stub(User, 'getOne', function (uid, callback) {
                if (uid !== publisherId) {
                    return callback(null, null);
                }
                callback(null, new User({_id: uid, nick: 'jack', avatar: 'avatar url'}));
            });
            sinon.stub(Tip, 'gets', function (tipIds, lookId, aspect, callback) {
                callback(null, []);
            });
            sinon.stub(Favorite, 'perfect', function (lookId, aspects, callback) {
                callback(null, [new Favorite({look:lookId, aspect: aspects[0], wants: [], tips:[]})]);
            })
        });
        afterEach(function () {
            Look.getOne.restore();
            User.getOne.restore();
            Tip.gets.restore();
            Favorite.perfect.restore();
        });
        it('should perfect publisher, tips and favorites info when look is exist', function (done) {
            LookService.getDetail(look._id, function (err, look) {
                should.not.exist(err);
                should.exist(look);
                Look.getOne.called.should.be.true;
                User.getOne.called.should.be.true;
                Favorite.perfect.called.should.be.true;
                Tip.gets.called.should.be.true;
                done();
            });
        });

        it('should not perfect user, tips and favorite info when look is not exist', function (done) {
            LookService.getDetail(new mongoose.Types.ObjectId, function (err, look) {
                should.not.exist(err);
                should.not.exist(look);
                Look.getOne.called.should.be.true;
                User.getOne.called.should.be.false;
                Tip.gets.called.should.be.false;
                Favorite.perfect.called.should.be.false;
                done();
            });
        });

        it('should be null when the publisher is not exist or invalid', function (done) {
            publisherId = new mongoose.Types.ObjectId;
            LookService.getDetail(look._id, function (err, look) {
                should.not.exist(err);
                should.not.exist(look);
                done();
            })
        });
    });

    describe('.like()', function() {
        var lookId = 'lookId';
        var uid = 'uid';
        afterEach(function() {
            Look.like.restore();
            UserLike.putNewLook.restore();
        });

        it('should update the look likes and the user likes when the look is valid', function(done) {
            sinon.stub(Look, 'like', function(lookId, uid, updated, callback) {
                callback(null, 1, '');
            });
            sinon.stub(UserLike, 'putNewLook', function(uid, lookId, callback) {
                callback(null, 1, '');
            });
            LookService.like(lookId, uid, function(err) {
                should.not.exist(err);
                Look.like.called.should.be.true;
                UserLike.putNewLook.called.should.be.true;
                done();
            });
        });

        it('should not update the look likes and the user likes when the look is invalid or not exist', function(done) {
            sinon.stub(Look, 'like', function(lookId, uid, updated, callback) {
                callback(null, 0, '');
            });
            sinon.stub(UserLike, 'putNewLook');
            LookService.like(lookId, uid, function(err) {
                should.exist(err);
                Look.like.called.should.be.true;
                UserLike.putNewLook.called.should.be.false;
                done();
            });
        });
    });

    describe('.addFavorite', function () {
        var lookId = 'look-id';
        var uid = 'uid';
        var aspect = 'shirt';

        afterEach(function () {
            Look.addFavorite.restore();
            FavoriteService.sync.restore();
        });

        it('should sync to Favorite and UserWant when the favorite is successfully added to look', function (done) {
            sinon.stub(Look, 'addFavorite', function (lookId, aspect, updated, callback) {
                callback(null, 1, '');
            });
            sinon.stub(FavoriteService, 'sync', function (uid, lookId, aspect, callback) {
                callback(null, 1, '')
            });

            LookService.addFavorite(lookId, uid, aspect, function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(1);
                Look.addFavorite.called.should.be.true;
                FavoriteService.sync.called.should.be.true;
                done();
            });
        });

        it('should not sync to Favorite and UserWant when fail to add favorite', function (done) {
            sinon.stub(Look, 'addFavorite', function (lookId, aspect, updated, callback) {
                callback(null, 0, '');
            });
            sinon.stub(FavoriteService, 'sync');

            LookService.addFavorite(lookId, uid, aspect, function (err, result) {
                should.exist(err);
                Look.addFavorite.called.should.be.true;
                FavoriteService.sync.called.should.be.false;
                done();
            });
        })
    })
});
