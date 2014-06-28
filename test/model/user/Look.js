/**
 * Created by daisy on 14-6-26.
 */
var should = require('should');
var mongoose = require('mongoose');
var async = require('async');

require('../../../common/mongo');
var UserLook = require('../../../model/user/Publish');//举例测试

describe('UserLook', function () {
    describe('.gets()', function () {
        var uid = new mongoose.Types.ObjectId;
        before(function (done) {
            async.each([
                'look1',
                'look2',
                'look3',
                'look4'
            ], function (lookId, callback) {
                UserLook.putNewLook(uid, lookId, callback);
            }, function (err) {
                should.not.exist(err);
                done();
            })
        });

        after(function (done) {
            UserLook.remove({_id: uid}, function (err) {
                done();
            });
        });

        it('should get all looks when the start is 0 and the num is 4', function (done) {
            UserLook.gets(uid, 0, 4, function (err, look) {
                should.not.exist(err);
                look.looks.should.with.lengthOf(4);
                done();
            });
        });

        it('should get all looks when the start is 0 and the num greater than 4', function (done) {
            UserLook.gets(uid, 0, 6, function (err, look) {
                should.not.exist(err);
                look.looks.should.with.lengthOf(4);
                done();
            });
        });

        it('should get less than 4 when the start greater than 0', function (done) {
            UserLook.gets(uid, 1, 5, function (err, look) {
                should.not.exist(err);
                look.looks.length.should.lessThan(4);
                done();
            });
        });

        it('should get less than 4 when the num less than 4', function (done) {
            UserLook.gets(uid, 0, 2, function (err, look) {
                should.not.exist(err);
                look.looks.length.should.lessThan(4);
                done();
            });
        });

        it('should get null when the start less than 0', function (done) {
            UserLook.gets(uid, -1, 4, function (err, look) {
                should.not.exist(err);
                should.not.exist(look);
                done();
            });
        });

        it('should get null when the num less than or equal to 0', function (done) {
            UserLook.gets(uid, 0, 0, function (err, look) {
                should.not.exist(err);
                should.not.exist(look);
                done();
            });
        });

        it('should get null when the user have not find any looks', function (done) {
            UserLook.gets(new mongoose.Types.ObjectId, 0, 4, function (err, look) {
                should.not.exist(err);
                should.not.exist(look);
                done();
            })
        })
    });
});