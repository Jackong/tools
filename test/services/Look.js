/**
 * Created by daisy on 14-6-21.
 */
var should = require('should');
var sinon = require('sinon');
var mongoose = require('mongoose');

require('../../common/mongo');
var Look = require('../../model/Look');
var TagLook = require('../../model/tag/Look');
var UserPublication = require('../../model/user/Publication');
var UserWant = require('../../model/user/Want');
var LookService = require('../../services/Look');

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
                        wants: [publisher],
                        wantCount: 1
                    }
                ]
            }
        );
    });
    describe('.firstPublish()', function () {
        it('should be saved and put to tags, publication and want', sinon.test(function (done) {
            var save = this.stub(look, 'save');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4Publication = this.stub(UserPublication, 'putNewLook');
            var putNewLook4Want = this.stub(UserWant, 'putNewLook');
            LookService.firstPublish(look, function (err, doc) {
                should.not.exist(err);
                doc.should.be.equal(look);
                done();
            });
            save.yield(null, null);
            putNewLook4Tag.yield(null);
            putNewLook4Publication.yield(null, null);
            putNewLook4Want.yield(null, null);
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
                            wants: [publisher],
                            wantCount: 1
                        }
                    ]
                }
            );
        });
        it('should update favorites, tags and want when they are different', sinon.test(function (done) {
            var updateLook = this.stub(Look, 'appendTagsAndFavorites');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4Want = this.stub(UserWant, 'putNewLook');
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.true;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(2);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            putNewLook4Want.yield(null, null);
            updateLook.yield(null, 1);
        }));

        it('should update favorites only when tags are not different', sinon.test(function (done) {
            var updateLook = this.stub(Look, 'appendTagsAndFavorites');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4Want = this.stub(UserWant, 'putNewLook');
            look.tags = old.tags;
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(1);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            putNewLook4Want.yield(null, null);
            updateLook.yield(null, 1);
        }));

        it('should not update when tags and favorites are not different', sinon.test(function (done) {
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4Want = this.stub(UserWant, 'putNewLook');
            look.tags = old.tags;
            look.favorites[0]._id = old.favorites[0]._id;
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(1);
                doc.favorites.should.with.lengthOf(1);
                done();
            });

            putNewLook4Want.yield(null, null);
        }));

        it('should not put new look to want when the publisher is the same', sinon.test(function (done) {
            var updateLook = this.stub(Look, 'appendTagsAndFavorites');
            var putNewLook4Tag = this.stub(TagLook, 'putNewLook');
            var putNewLook4Want = this.stub(UserWant, 'putNewLook');
            look.publisher = old.publisher;
            LookService.republish(old, look, function (err, doc) {
                putNewLook4Tag.called.should.be.true;
                putNewLook4Want.called.should.be.false;
                should.not.exist(err);
                doc.tags.should.with.lengthOf(2);
                doc.favorites.should.with.lengthOf(2);
                done();
            });

            updateLook.yield(null, 1);
        }))
    })
});