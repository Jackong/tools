/**
 * Created by daisy on 14-6-23.
 */
var should = require('should');
var mongoose = require('mongoose');
var async = require('async');

require('../../../common/mongo');
var TagLook = require('../../../model/tag/Look');

describe('TagLook', function () {
    describe('.putNewLook()', function () {
        var tags = null;
        var lookId = null;
        beforeEach(function () {
            tags = [];
            lookId = new mongoose.Types.ObjectId;
        });

        it('should be successful when only 1 tag', function (done) {
            tags.push('jack');
            TagLook.putNewLook(tags, lookId, function (err) {
                should.not.exist(err);
                done();
            }); 
        });

        it('should successful when more than 1 tags', function (done) {
            tags.push('jack');
            tags.push('daisy');
            TagLook.putNewLook(tags, lookId, function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be failure with empty tags', function (done) {
            TagLook.putNewLook(tags, lookId, function (err) {
                should.exist(err);
                done();
            })
        });

        afterEach(function () {
            TagLook.remove({
                _id: {
                    $in: tags
                }
            }).exec();
        });
    });

    describe('.calLookCount()', function () {
        var tag = 'jack';
        it('should be 1 when only look be put', function (done) {
            async.waterfall([
                function (callback) {
                    TagLook.putNewLook([tag], new mongoose.Types.ObjectId, function (err) {
                        should.not.exist(err);
                        callback(null, 1);
                    })
                }
            ], function (err, count) {
                TagLook.calLookCount(tag, function (err, res) {
                    should.not.exist(err);
                    res[0].count.should.be.exactly(count);
                    done();
                })
            });
        });

        it('should be 2 when 2 look be put', function (done) {
            async.waterfall([
                function (callback) {
                    TagLook.putNewLook([tag], new mongoose.Types.ObjectId, function (err) {
                        should.not.exist(err);
                        callback(null, 1);
                    })
                }
            ], function (err, count) {
                TagLook.calLookCount(tag, function (err, res) {
                    should.not.exist(err);
                    res[0].count.should.be.exactly(count + 1);
                    done();
                })
            });
        });

        after(function () {
            TagLook.remove({
                _id: tag
            }).exec();
        })
    });
});