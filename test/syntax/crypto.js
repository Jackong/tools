/**
 * Created by daisy on 14-6-3.
 */

require('should');
var util = require('../../common/util');

describe('crypto', function () {
    describe('.encrypt() & .decrypt()', function () {
        it('should be equal after cipher and decipher', function () {
            var enc = JSON.stringify({a: 'b'});
            var crypted = util.encrypt(enc);
            var dec = util.decrypt(crypted);
            dec.should.be.equal(enc);
        });
    });
});