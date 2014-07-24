
var should  = require('should');
var sinon = require('sinon');
var Favorite = require('../../model/Favorite');
var Look = require('../../model/Look');
var UserNotification = require('../../model/user/Notification');
var NotificationService = require('../../services/Notification');

describe('Favorite', function() {
	describe('.want()', function() {
		var lookId = 'look-id';
        var aspect = 'shirt';
        var uid = 'uid';
		it('should be emit want event', function(done) {
            Favorite.onWant(NotificationService.onWant);
            sinon.stub(Favorite, 'update', function (conditions, obj, callback) {
                callback();
            });
            sinon.stub(Look, 'getOne', function (lookId, callback) {
                callback(null, {publisher: 'publisher'})
            });
            sinon.stub(UserNotification, 'add', function (from, to, action, look, callback) {
                Look.getOne.called.should.be.true;
                callback();
                done();
            });

			Favorite.want(lookId, aspect, uid, function(err, num) {
                Favorite.update.called.should.be.true;
            });
		});
	});
});
