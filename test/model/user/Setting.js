/**
 * Created by daisy on 14-7-25.
 */

var should = require('should');
require('../../../common/mongo');
var UserSetting = require('../../../model/user/Setting');

describe('Setting', function () {

    describe('.change()', function () {
        var uid = 'uid-exist';

        before(function (done) {
            var setting = new UserSetting({_id: uid});
            setting.save(function (err, doc) {
                should.not.exist(err);
                doc.should.have.property('notify', true);
                done();
            })
        });

        after(function () {
            UserSetting.remove({_id: uid}).exec();
        });

        it('should be success when the switch is exist', function (done) {
            UserSetting.change(uid, {notify: false}, function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(1);
                UserSetting.retrieve(uid, function (err, setting) {
                    should.not.exist(err);
                    setting.should.have.property('notify', false);
                    done();
                });
            });
        });

        it('should be success when the switch is not exist', function (done) {
            UserSetting.change(uid, {notExist: false}, function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(1);
                done();
            });
        });
    });
});