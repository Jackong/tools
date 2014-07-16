/**
 * Created by daisy on 14-5-30.
 */

var sinon = require('sinon');

require('../../common/mongo');

var should = require("should");

var User = require('../../model/User');
var UserService = require('../../services/User');
var helper = require('../../common/helper');
var USER_PLATFORM = require('../../common/const').USER_PLATFORM;

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

    describe('.logout()', function() {
    	it('should call cleanCookie when logout', sinon.test(function(){
		var req = {};
		var res = {
			clearCookie: this.stub()
		};
		UserService.logout(req, res);
		res.clearCookie.called.should.be.true;
	}));
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

    describe('.register()', function () {
        beforeEach(function () {
            var user = new User({_id: USER_PLATFORM.EMAIL + '|' + existAccount, account:existAccount, password: password});
            user.save();
        });

        afterEach(function () {
            User.remove({_id: USER_PLATFORM.EMAIL + '|' + existAccount}).exec();
            User.remove({_id: USER_PLATFORM.EMAIL + '|' + notExistAccount}).exec();
        });

        it('should register successfully when uid is not exists', function (done) {
            UserService.register(USER_PLATFORM.EMAIL, notExistAccount, password, function (err, user) {
                should.not.exist(err);
                should.exist(user);
                done();
            });
        });

        it('should fail to register when uid is exists', function (done) {
            UserService.register(USER_PLATFORM.EMAIL, existAccount, password, function (err, user) {
                should.exist(err);
                done();
            });
        });
    })
});
