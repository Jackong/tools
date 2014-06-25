/**
 * Created by daisy on 14-5-30.
 */

require('../../common/mongo');
var should = require("should");

var User = require('../../model/User');
var helper = require('../../common/helper');

describe('UserService', function () {
    var existAccount = 'exists@account.com';
    var notExistAccount = 'not-exists@account.com';
    var password = 'password';
    var newPassword = 'newPassword';

    describe('#account', function () {
        beforeEach(function () {
            User.remove({account: notExistAccount}).exec();
            User.remove({account: existAccount}).exec();
            User.create({account: existAccount, password: password, time: helper.date()});
        });

        describe('.save()', function () {
            it('should be successful when the account is not exists', function (done) {
                var user = new User({account: notExistAccount, password: password});
                user.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be fail when the account is exists', function (done) {
                var user = new User({account: existAccount, password: password});
                user.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });

        describe('.del()', function () {
            it('should be successful when the account is exists', function (done) {
                User.remove({account: existAccount}, function (err, numberAffected) {
                    numberAffected.should.be.exactly(1);
                    done();
                });
            });
            it('should be fail when the account is not exists', function (done) {
                User.remove({account: notExistAccount}, function (err, numberAffected) {
                    numberAffected.should.be.exactly(0);
                    done();
                });
            });
        });


        describe('.updatePassword()', function () {
            it('should be fail when the account is not exists', function (done) {
                User.update({account: notExistAccount, password: password}, {password: newPassword}, function (err, numberAffected) {
                    numberAffected.should.be.exactly(0);
                    done();
                });
            });
            it('should be successful when the account is exists', function (done) {
                User.update({account: existAccount, password: password}, {password: newPassword}, function (err, numberAffected) {
                    numberAffected.should.be.exactly(1);
                    done();
                });
            });
            it('should be fail when the old password is not right', function (done) {
                User.update({account: existAccount, password: newPassword}, {password: newPassword}, function (err, numberAffected) {
                    numberAffected.should.be.exactly(0);
                    done();
                });
            })
        });

        describe('.get()', function () {
            it('should be null when the account is not exists', function (done) {
                User.findOne({account: notExistAccount}, 'password', {lean: true}, function (err, user) {
                    should.not.exist(user);
                    done();
                });
            });
            it('should be not null when the account is exists', function (done) {
                User.findOne({account: existAccount}, 'password', {lean: true}, function (err, user) {
                    should.exist(user);
                    user.should.be.an.object;
                    user.password.should.be.equal(password);
                    done();
                });

            })
        });
    });
});
