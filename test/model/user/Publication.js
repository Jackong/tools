/**
 * Created by daisy on 14-6-9.
 */
var should = require('should');
var UserPublication = require('../../../model/user/Publication');

describe('UserPublication', function () {
    describe('.publish()', function () {
        it('should be fail when image was not uploaded', function (done) {
            done();
        });
        it('should be fail when favorites are not set', function (done) {
            done();
        });
        it('should notify related tags when success', function (done) {
            done();
        });
        it('should notify the feed of my followers when success', function (done) {
            done();
        });
        it('should notify my want when success', function (done) {
            done();
        })
    });
    describe('.gets()', function () {
        it('should be return empty when the user did not published anything', function (done) {
            done();
        });
        it('should be return not empty when the user published something', function (done) {
            done();
        })
    });
});