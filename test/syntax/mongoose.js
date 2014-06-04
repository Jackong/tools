/**
 * Created by daisy on 14-6-4.
 */
require('should');
require('../../common/mongo');
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    test: {type: String, lowercase: true, trim: true}
});
var Test = mongoose.model('Test', schema);

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

    afterEach(function () {
        Test.remove({test: 'jackongc@gmail.com'}, function (err, num) {
            (null === err).should.be.true;
            num.should.be.equal(1);
        });
    })
});