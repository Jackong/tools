/**
 * Created by daisy on 14-6-21.
 */
var should = require('should');
var sinon = require('sinon');
var mongoose = require('mongoose');
var async = require('async');

require('../../common/mongo');
var Look = require('../../model/Look');
var TagLook = require('../../model/tag/Look');
var UserLook = require('../../model/user/Look');
var User = require('../../model/User');
var LookService = require('../../services/Look');

sinon.config = {
    useFakeTimers: false,
    useFakeServer: false
};

describe('Look', function () {
    var look = null;
    beforeEach(function () {
        var publisher = new mongoose.Types.ObjectId;
        look = new Look(
            {
                _id: new mongoose.Types.ObjectId,
                publisher: publisher,
                image: 'image',
                tags: ['nice', 'dress'],
                description: 'desc',
                favorites: [
                    {
                        _id: 'shirt',
                        wants: [publisher]
                    }
                ]
            }
        );
    });
    describe('.firstPublish()', function () {
        it('should be saved and put to tags, publication and want', sinon.test(function (done) {
            var save = this.stub(look, 'save');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4User = this.stub(UserLook, 'putNewLook');
            LookService.firstPublish(look, function (err, doc) {
                should.not.exist(err);
                doc.should.be.equal(look);
                putNewLook4User.calledTwice.should.be.true;
                done();
            });
            save.yield(null, null);
            putNewLook4Tag.yield(null);
            putNewLook4User.yield(null, null);
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
                        {
                            _id: 'glasses',
                            wants: [publisher]
                        }
                    ]
                }
            );
        });
        it('should update favorites, tags and want when they are different', sinon.test(function (done) {
            var updateLook = this.stub(Look, 'appendTagsAndFavorites');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4User = this.stub(UserLook, 'putNewLook');
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.true;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(2);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            putNewLook4User.yield(null, null);
            updateLook.yield(null, 1);
        }));

        it('should update favorites only when tags are not different', sinon.test(function (done) {
            var updateLook = this.stub(Look, 'appendTagsAndFavorites');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4User = this.stub(UserLook, 'putNewLook');
            look.tags = old.tags;
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(1);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            putNewLook4User.yield(null, null);
            updateLook.yield(null, 1);
        }));

        it('should not update when tags and favorites are not different', sinon.test(function (done) {
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4User = this.stub(UserLook, 'putNewLook');
            look.tags = old.tags;
            look.favorites[0]._id = old.favorites[0]._id;
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(1);
                doc.favorites.should.with.lengthOf(1);
                done();
            });

            putNewLook4User.yield(null, null);
        }));

        it('should not put new look to want when the publisher is the same', sinon.test(function (done) {
            var updateLook = this.stub(Look, 'appendTagsAndFavorites');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4User = this.stub(UserLook, 'putNewLook');
            look.publisher = old.publisher;
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.true;
                putNewLook4User.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(2);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            updateLook.yield(null, 1);
        }));
    });

    describe('.getTrend()', function () {
        afterEach(function () {
            Look.getTrend.restore();
            User.perfect.restore();
        });
        it('should perfect publishers info when looks is not empty', function (done) {
            sinon.stub(Look, 'getTrend', function (start, num, callback) {
                callback(null, [look]);
            });
            sinon.stub(User, 'perfect', function (uids, callback) {
                var user = {};
                user[look.publisher] = new User({_id: look.publisher, nick: 'jack', avatar: 'avatar url'});
                callback(null, user);
            });
            LookService.getTrend(0, 1, function (err, looks) {
                should.not.exist(err);
                looks.should.with.lengthOf(1);
                User.perfect.called.should.be.true;
                done();
            });
        });

        it('should not perfect publisher info when looks is empty', function (done) {
            sinon.stub(Look, 'getTrend', function (start, num, callback) {
                callback(null, []);
            });
            sinon.stub(User, 'perfect');
            LookService.getTrend(0, 1, function (err, looks) {
                should.not.exist(err);
                looks.should.with.lengthOf(0);
                User.perfect.called.should.be.false;
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
            LookService.getTrend(0, 1, function (err, looks) {
                should.not.exist(err);
                looks.should.with.lengthOf(0);
                User.perfect.called.should.be.true;
                done();
            });
        });
    })
});