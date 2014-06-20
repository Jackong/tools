/**
 * Created by daisy on 14-6-19.
 */

var should = require('should');
var sinon = require('sinon');

function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

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
        })
    })
});