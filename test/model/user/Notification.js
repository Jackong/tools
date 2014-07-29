
var should = require('should');
var async = require('async');
var mongoose = require('mongoose');

require('../../../common/mongo');

var ACTION = require('../../../common/const').NOTIFICATION_ACTION;
var UserNotification = require('../../../model/user/Notification');

describe('Notification', function() {

    var to = 'to-uid';
    var toExisted = 'to-uid-exist';
    var from = 'from-uid';
    var action = ACTION.LIKE_MY_LOOK;
    var look = 'look-id';

	describe('.add()', function() {

		before(function(done){
			UserNotification.create({_id: toExisted, notifications: [{from: from, action: ACTION.LIKE_MY_TIP, look: look}]}, function(err, doc) {
				should.not.exist(err);
				should.exist(doc);
				done();
			});
		});

		after(function() {
			UserNotification.remove({_id: toExisted}).exec();	
			UserNotification.remove({_id: to}).exec();	
		});	

		it('should be success when the document is not exist', function(done) {
			UserNotification.add(from, to, action, look, function(err, num) {
				should.not.exist(err);
				num.should.be.exactly(1);
				done();
			});	
		});

		it('should be success when the document is exist', function(done) {
			UserNotification.add(from, toExisted, action, look, function(err, num) {
				should.not.exist(err);
				num.should.be.exactly(1);
				UserNotification.findById(toExisted, function(err, doc) {
					should.not.exist(err);
					doc.should.have.property('notifications').with.lengthOf(2);	
					done();
				});
			});	
		});

		it('should be success when having contain this notification', function(done){
			UserNotification.add(from, toExisted, ACTION.LIKE_MY_TIP, look, function(err, num) {
				should.not.exist(err);
				num.should.be.exactly(1);
				done();
			});	
		});

        it('should be fail when the from is the to', function (done) {
            UserNotification.add(from, from, ACTION.LIKE_MY_TIP, look, function(err, num) {
                should.not.exist(err);
                num.should.be.exactly(0);
                done();
            });
        });
	});
    
    describe('.read()', function () {
        before(function (done) {
            UserNotification.add(from, to, ACTION.LIKE_MY_TIP, look, function(err, num) {
                should.not.exist(err);
                num.should.be.exactly(1);
                done();
            });
        });

        after(function () {
            UserNotification.remove({_id: to}).exec();
        });

        it('should be success when pass only with _id', function (done) {
            async.waterfall([
                function (callback) {
                    UserNotification.gets(to, 0, 1, callback);
                },
                function (notification, callback) {
                    notification.should.have.property('notifications').with.lengthOf(1);
                    UserNotification.read(to, [notification.notifications[0]._id], callback);
                }
            ], function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(1);
                done();
            });
        });

        it('should be fail when the _id is not exist', function (done) {
            UserNotification.read(to, [new mongoose.Types.ObjectId], function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(0);
                done();
            });
        });

        it('should be fail when the user without any notification', function (done) {
            UserNotification.read(from, [new mongoose.Types.ObjectId], function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(0);
                done();
            });
        });
    })
});
