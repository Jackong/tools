/**
 * Created by daisy on 14-6-4.
 */
var should = require('should');
require('../../common/mongo');
var mongoose = require('mongoose');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var helper = require('../../common/helper');


var TestSchema = mongoose.Schema({
    test: {type: String, lowercase: true, trim: true},
    test2: String
});

helper.modelMethods(TestSchema.statics, {
    go: function (base, obj, arr) {
        this.emit('go', base, obj, arr);
    }
});

util.inherits(TestSchema, EventEmitter);

var Test = mongoose.model('Test', TestSchema);

describe('mongoose', function () {
    describe('#lowercase', function () {
        it('should be convert to lowercase', function (done) {
            var test = new Test({test: 'JACKoNgC@GmAIl.coM'});
            test.save(function (err, doc) {
                (null === err).should.be.true;
                doc.test.should.be.equal('jackongc@gmail.com');
                done();
            })
        })
    });

    describe('#trim', function () {
        it('should be trim', function (done) {
            var test = new Test({test: ' JACKoNgC@GmAIl.coM '});
            test.save((function (err, doc) {
                (null === err).should.be.true;
                doc.test.should.be.equal('jackongc@gmail.com');
                done();
            }));
        })
    });

    describe('#pre', function () {
        it('should be modify for document before save', function (done) {
            TestSchema.pre('save', function (next) {
                this.test2 = 'JackongC@gmail.com';
                next();
            });
            var test = new Test({test: 'jackongc@gmail.com', test2: 'jackongc@gmail.com'});
            test.save(function (err, doc) {
                should.not.exist(err);
                doc.test2.should.be.equal('JackongC@gmail.com');
                done();
            });
        });
    });

    afterEach(function () {
        Test.remove({test: 'jackongc@gmail.com'}, function (err, num) {
            (null === err).should.be.true;
            num.should.be.equal(1);
        });
    });
});

describe('mongoose', function () {
    describe('#event', function () {
        it('should notify the model listener when test model is emitting the go event', function (done) {
            Test.once('go', function (base, obj, arr) {
                base.should.be.equal('base');
                obj.should.be.an.object;
                arr.should.be.an.array;
                done();
            });
            var str = 'base';
            var obj = {};
            var arr = [];
            Test.go(str, obj, arr);
        });

        it('should be modify for object and array (except base) on event', function () {
            Test.once('go', function (base, obj, arr) {
                base = 'ok';
                obj.p = 'property';
                arr.push(1);
            });
            var str = 'base';
            var obj = {};
            var arr = [];
            Test.go(str, obj, arr);
            str.should.be.equal('base');
            obj.should.have.property('p');
            arr.should.have.lengthOf(1);
        });

    });
});