/**
 * Created by daisy on 14-6-3.
 */

require('should');
var helper = require('../../common/helper');

describe('crypto', function () {
    describe('.encrypt() & .decrypt()', function () {
        it('should be equal after cipher and decipher', function () {
            var enc = JSON.stringify({a: 'b'});
            var crypted = helper.encrypt(enc);
            var dec = helper.decrypt(crypted);
            dec.should.be.equal(enc);
        });
    });
});