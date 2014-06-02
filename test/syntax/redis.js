/**
 * Created by daisy on 14-6-2.
 */

require('should');
var redis = require('../../common/redis');

describe('redis', function () {
    it('should be set and get', function (done) {
        redis.set('jack', 'ok');
        redis.get('jack', function (err, result) {
            (null === err).should.be.true;
            result.should.be.equal('ok');
            done();
        });
    });
    afterEach(function () {
        redis.del('jack');
    })
});