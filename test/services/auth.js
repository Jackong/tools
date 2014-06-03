/**
 * Created by daisy on 14-5-30.
 */

require('../../common/mongo');
require("should");

var authService = require('../../services/auth');
var Auth = require('../../model/Auth');
var util = require('../../common/util');
var system = require('../../common/config')('system');
var redis = require('../../common/redis');

var existAccount = 'exists@account.com';
var notExistAccount = 'not-exists@account.com';
var password = 'password';
var newPassword = 'newPassword';

describe('auth', function () {


    beforeEach(function () {
        Auth.remove({account: notExistAccount}).exec();
        Auth.create({account: existAccount, password: password, time: util.date()});
    });

    describe('.create()', function () {
        it('should be successful when the account is not exists', function (done) {
            authService.create(notExistAccount, password, function (err) {
                (err === null).should.be.true;
                done();
            });
        });

        it('should be fail when the account is exists', function (done) {
            authService.create(existAccount, password, function (err) {
                (null === err).should.be.false;
                done();
            });
        });
    });

    describe('.del()', function () {
        it('should be successful when the account is exists', function (done) {
            authService.del(existAccount, function (err, numberAffected) {
                numberAffected.should.be.equal(1);
                done();
            });
        });
        it('should be fail when the account is not exists', function (done) {
            authService.del(notExistAccount, function (err, numberAffected) {
                numberAffected.should.be.equal(0);
                done();
            });
        });
    });

    describe('.updatePassword()', function () {
        it('should be fail when the account is not exists', function (done) {
            authService.updatePassword(notExistAccount, newPassword, function (err, numberAffected) {
                numberAffected.should.be.equal(0);
                done();
            });
        });
        it('should be successful when the account is exists', function (done) {
            authService.updatePassword(existAccount, newPassword, function (err, numberAffected) {
                numberAffected.should.be.equal(1);
                done();
            });
        });
    });

    describe('.get()', function () {
        it('should be null when the account is not exists', function (done) {
            authService.get(notExistAccount, function (err, auth) {
                (auth === null).should.be.true;
                done();
            });
        });
        it('should be not null when the account is exists', function (done) {
            authService.get(existAccount, function (err, obj) {
                (obj === null).should.be.false;
                obj.should.be.an.object;
                obj.password.should.be.equal(password);
                done();
            });

        })
    });

    describe('.reset()', function () {
        it('should be return false when sign is not match', function () {
            authService.reset(existAccount, util.encrypt(JSON.stringify({account: notExistAccount, expiration: util.time() + 30 * 60}))).should.be.false;
        });

        it('should be return false when sign is expired', function () {
            authService.reset(existAccount, util.encrypt(JSON.stringify({account: existAccount, expiration: util.time() - 1}))).should.be.false;
        });

        it('should be return true when sign is match and not expired', function () {
            authService.reset(existAccount, util.encrypt(JSON.stringify({account: existAccount, expiration: util.time() + 1}))).should.be.true;
        });

        it('should be return false when sign is can not decode', function () {
            authService.reset(existAccount, util.encrypt('aha')).should.be.false;
        });

        it('should be return false when sign is null', function () {
            authService.reset(existAccount, null).should.be.false;
        });
    });

    afterEach(function () {
        Auth.remove({account: existAccount}).exec();
    });
});
