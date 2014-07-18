/**
 * Created by daisy on 14-6-23.
 */
var should = require('should');
var async = require('async');
require('../../common/mongo');
var Look = require('../../model/Look');

describe('Look', function() {
	describe('.like()', function() {
		var uid = 'user-id';
		var validLookId = 'valid-lookId';
		var invalidLookId = 'invalid-lookId';
		var notExistLookId = 'not-exist-lookId';
		beforeEach(function(done) {
			async.parallel([
				function(callback) {
					Look.create({_id: validLookId, isValid: true}, callback);
				},
				function(callback) {
					Look.create({_id: invalidLookId, isValid: false}, callback);	
				},
				function(callback) {
					Look.remove({_id: notExistLookId}, callback);
				}
			], function(err) {
				done();
			});
		});

		afterEach(function() {
			Look.remove({_id: validLookId}).exec();
			Look.remove({_id: invalidLookId}).exec();
		});

		it('should be fail when the look is not exist', function(done) {
			Look.like(notExistLookId, uid, function(err, num) {
				should.not.exist(err);
				num.should.be.exactly(0);
				done();	
			});
		});

		it('should be fail when the look is invalid', function(done) {
			Look.like(invalidLookId, uid, function(err, num) {
				should.not.exist(err);
				num.should.be.exactly(0);
				done();
			});	
		});	

		it('should be success when the look is valid', function(done) {
			Look.like(validLookId, uid, function(err, num) {
				should.not.exist(err);
				num.should.be.exactly(1);
				done();
			});
		});
	});
});
