/**
 * Created by daisy on 14-6-15.
 */

var should = require('should');
var async = require('async');

describe('async', function () {
    describe('.waterfall()', function () {
        it('should be no error and equal to 2', function () {
            async.waterfall(
                [
                    function (callback) {
                        callback(null, 1);
                    },
                    function (idx, callback) {
                        callback(null, idx+1);
                    }
                ],
                function (err, result) {
                    result.should.be.equal(2);
                }
            )
        })
    });
    var arr = null;
    beforeEach(function () {
        arr = [{a:1}, {a:2}, {a:3}];
    });
    describe('.each()', function () {
        it('should be modify by iterator', function () {
            async.each(arr, function (item, callback) {
                item.a += 1;
                callback();
            }, function (err) {
                arr[0].a.should.be.equal(2);
                arr[1].a.should.be.equal(3);
                arr[2].a.should.be.equal(4);
            })
        });
        it('should be stop when error', function () {
            async.each(arr, function (item, callback) {
                if (item.a == 2) {
                    return callback('error');
                }
                item.a += 1;
                callback();
            }, function (err) {
                should.exist(err);
                //!!!may be fail (because async)
                arr[0].a.should.be.equal(2);
                arr[1].a.should.be.equal(2);
                arr[2].a.should.be.equal(3);
            })
        })
    });

    describe('.filter()', function () {
        it('should be modify by iterator', function () {
            async.filter(arr, function (item, callback) {
                item.a += 1;
                callback(item.a === 2);
            }, function (result) {
                result.should.with.lengthOf(1);
                result[0].should.have.property('a', 2);
            })
        })
    })
});