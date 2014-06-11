/**
 * Created by daisy on 14-6-10.
 */
var should = require('should');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Subject() {
    this.notify = function () {
        this.emit('onUpdate', 'old', 'new')
    }
}

util.inherits(Subject, EventEmitter);

describe('Event', function () {
    describe('.on()', function () {
        it('should be notify when event is emit', function (done) {
            var subject = new Subject();
            subject.on('onUpdate', function (oldVal, newVal) {
                oldVal.should.be.equal('old');
                newVal.should.be.equal('new');
                done();
            });
            subject.notify();
        });
    });
});

