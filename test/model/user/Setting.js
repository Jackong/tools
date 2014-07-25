/**
 * Created by daisy on 14-7-25.
 */

var should = require('should');
require('../../../common/mongo');
var TYPE = require('../../../common/const').SETTING_TYPE;
var UserSetting = require('../../../model/user/Setting');

describe('Setting', function () {

    describe('.change()', function () {
        var uid = 'uid-exist';

        before(function (done) {
            var setting = new UserSetting({_id: uid});
            setting.save(function (err, doc) {
                should.not.exist(err);
                doc.should.have.property(TYPE.NOTIFY, true);
                done();
            })
        });

        after(function () {
            UserSetting.remove({_id: uid}).exec();
        });

        it('should be success when the switch is exist', function (done) {
            UserSetting.change(uid, TYPE.NOTIFY, false, function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(1);
                UserSetting.get(uid, function (err, setting) {
                    should.not.exist(err);
                    setting.should.have.property(TYPE.NOTIFY, false);
                    done();
                });
            });
        });

        it('should be fail when the switch is not exist', function (done) {
            UserSetting.change(uid, TYPE.NOTIFY + 'xxoo', false, function (err, num) {
                should.not.exist(err);
                num.should.be.exactly(0);
                done();
            });
        });
    });
});