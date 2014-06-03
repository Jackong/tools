/**
 * Created by daisy on 14-6-3.
 */

require('should');
var crypto = require('crypto');
var system = require('../../common/config')('system');

describe('crypto', function () {
    describe('#aes', function () {
        it('should be equal after cipher and decipher', function () {
            var cipher = crypto.createCipher('aes-256-cbc', system.salt);
            var enc = JSON.stringify({a: 'b'});
            var crypted = cipher.update(enc,'utf8','hex');
            crypted += cipher.final('hex');
            var decipher = crypto.createDecipher('aes-256-cbc', system.salt);
            var dec = decipher.update(crypted,'hex','utf8');
            dec += decipher.final('utf8');
            dec.should.be.equal(enc);
        });
    });
});