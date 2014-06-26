/**
 * Created by daisy on 14-6-19.
 */

var should = require('should');
var sinon = require('sinon');
var async = require('async');

sinon.config = {
    useFakeTimers: false,
    useFakeServer: false
};
describe('sinon', function () {
    describe('spy', function () {
        it("calls the original function", function () {
            var object = { method: function () {
                return 'jack';
            } };
            var spy = sinon.spy(object, "method");

            object.method('daisy');

            spy.called.should.be.true;
            spy.calledWithExactly('daisy').should.be.true;
            spy.returned('jack').should.be.true;
        });
    });
    describe('stub', function () {
        it('do not calls the original function', function () {
            var object = {
                method: function (obj) {
                    return 'jack';
                }
            };
            var stub = sinon.stub(object, 'method');
            stub.yieldsTo('callback', 'daisy');

            object.method({
                callback: function (arg) {
                    arg.should.be.equal('daisy');
                }
            });

            stub.called.should.be.true;
            stub.returned('jack').should.be.false;
        });

        it('should be normal to using async.waterfall only with global sinon and inject callback', function (done) {
            var obj = {
                method: function (arg, callback) {
                    callback(null, arg + 1);
                }
            };
            var a = function (arg, callback) {
                async.waterfall([
                    function (callback) {
                        callback(null, 1)
                    },
                    function (idx, callback) {
                        obj.method(idx, callback);
                    }
                ], callback);
            };

            sinon.stub(obj, 'method', function (arg, callback) {
                callback(null, arg + 3);
            });

            a(1, function (err, result) {
                result.should.be.exactly(4);
                done();
            });

        });

        it('should normal when using async.parallel', sinon.test(function (done) {
            var obj = {
                method: function (arg, callback) {
                    callback(null, arg);
                }
            };


            var a = function (arg, callback) {
                async.parallel([
                    function (callback) {
                        obj.method(arg, callback);
                    },
                    function (callback) {
                        callback(null, 2);
                    }
                ], callback);
            };

            var stub = this.stub(obj, 'method');
            a(1, function (err, result) {
                result[0].should.be.exactly(3);
                result[1].should.be.exactly(2);
                done();
            });
            stub.yield(null, 3);
        }));
    });

});