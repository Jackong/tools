/**
 * Created by daisy on 14-5-30.
 */

var should = require("should");

var UserService = require('../../services/User');
var helper = require('../../common/helper');

describe('UserService', function () {
    var existAccount = 'exists@account.com';
    var notExistAccount = 'not-exists@account.com';
    var password = 'password';
    var newPassword = 'newPassword';

    describe('.canReset()', function () {
        it('should be return false when sign is not match', function () {
            UserService.canReset(existAccount, helper.encrypt(JSON.stringify({account: notExistAccount, expiration: helper.time() + 30 * 60}))).should.be.false;
        });

        it('should be return false when sign is expired', function () {
            UserService.canReset(existAccount, helper.encrypt(JSON.stringify({account: existAccount, expiration: helper.time() - 10}))).should.be.false;
        });

        it('should be return true when sign is match and not expired', function () {
            UserService.canReset(existAccount, helper.encrypt(JSON.stringify({account: existAccount, expiration: helper.time() + 10}))).should.be.true;
        });

        it('should be return false when sign is can not decode', function () {
            UserService.canReset(existAccount, helper.encrypt('aha')).should.be.false;
        });

        it('should be return false when sign is null', function () {
            UserService.canReset(existAccount, null).should.be.false;
        });
    });

    describe('.login()', function () {
        it('should set the account as token on cookie', function (done) {
            var req = {};
            var res = {
                cookie: function (uid, value, options) {
                    uid.should.be.equal('uid');
                    value.should.be.equal(existAccount);
                    options.should.be.eql({ signed: true, httpOnly: true, maxAge: 86400000 * 15, path: '/' });
                    done();
                }
            };
            UserService.login(existAccount, req, res);
        });
    });

    describe('.getUid()', function () {
        it('should be get account when signed-cookie is valid', function () {
            var req = {
                signedCookies: {
                    uid: existAccount
                }
            };
            var res = {};
            UserService.getUid(req, res).should.be.equal(existAccount);
        });

        it('should get null when signed-cookie is null', function () {
            var req = {
                signedCookies: {
                    uid: null
                }
            };
            var res = {};
            (null === UserService.getUid(req, res)).should.be.true;
        });
    });
});
