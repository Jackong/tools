/**
 * Created by daisy on 14-5-30.
 */

var sinon = require('sinon');

require('../../common/mongo');

var should = require("should");

var User = require('../../model/User');
var Auth = require('../../model/Auth');

var UserService = require('../../services/User');
var AUTH_PLATFORM = require('../../common/const').AUTH_PLATFORM;

sinon.config = {
    useFakeTimers: false,
    useFakeServer: false
};
describe('UserService', function () {
    var existAccount = 'exists@account.com';
    var password = 'password';
    var newPassword = 'newPassword';

    describe('.login()', function () {
        it('should set the account as token on cookie', function (done) {
            var req = {};
            var res = {
                cookie: function (uid, value, options) {
                    uid.should.be.equal('uid');
                    value.should.be.equal(existAccount);
                    options.should.be.eql({ signed: true, httpOnly: true, maxAge: UserService.MAX_AGE, path: '/' });
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

    describe('.sync()', function () {
        var userInfo = {
            username: "Jerry",
            sex: "2",
            birthday: "1990-01-09",
            tinyurl: "http://logo.kaixin001.com.cn/logo/8/27/50_152082706_1.jpg",
            headurl: "http://logo.kaixin001.com.cn/logo/8/27/100_152082706_1.jpg",
            mainurl: "http://logo.kaixin001.com.cn/logo/8/27/200_152082706_1.jpg",
            hometown_location: "北京",
            work_history: "百度",
            university_history: "北京大学",
            hs_history: "北京中学",
            province: "北京",
            city: "北京",
            is_verified: "0",
            media_uid: "152082706",
            media_type: "kaixin",
            social_uid: 282335
        };
        var accessToken = '51.8adcea7ae4cf52c2cdb9c7506a160692.7776000.1413634343.1392799156-2819637';

        it('should create or update Auth and User when every thing is ok', sinon.test(function (done) {
            this.stub(Auth, 'createOrUpdate', function (authId, token, platform, uid, updated, expires, callback) {
                callback(null, 1, 'raw');
            });
            this.stub(UserService, 'getUserInfo', function (accessToken, callback) {
                callback(null, {statusCode: 200}, userInfo);
            });
            this.stub(User, 'createOrUpdate', function (uid, obj, callback) {
                callback(null, 1, 'raw');
                Auth.createOrUpdate.called.should.be.true;
                UserService.getUserInfo.called.should.be.true;
                User.createOrUpdate.called.should.be.true;
                done();
            });
            UserService.sync(AUTH_PLATFORM.QQ, userInfo.media_uid, accessToken, userInfo.username, UserService.MAX_AGE, function (err, uid) {
                should.not.exist(err);
            });
        }));
    });
});
