/**
 * Created by daisy on 14-5-30.
 */

require("should");

var account = require('../../services/account');

describe('account', function(){
    beforeEach(function () {
        //todo delete 'not-exists@account.com' from db
        //todo save 'exists@account.com', 'password' into db
    });

    describe('.save()', function(){

        it('should return true when the account is not exists', function(){
            account.save('not-exists@account.com', 'password').should.be.true;
        });

        it('should return false when the account is exists', function () {
            account.save('exists@account.com', 'password').should.be.false;
        });
    });
    
    describe('.del()', function () {
        it('should return true when the account is exists', function () {
            account.del('exists@account.com').should.be.true;
        });
        it('should return false when the account is not exists', function () {
            account.del('not-exists@account.com').should.be.false;
        });
    });

    describe('.updatePassword()', function () {
        it('should return false when the account is not exists', function () {
            account.updatePassword('not-exists@account.com', 'new-password').should.be.false;
        });
        it('should return true when the account is exists', function () {
            account.updatePassword('exists@account.com', 'new-password').should.be.true;
        });
    });

    describe('.get()', function () {
        it('should return null when the account is not exists', function () {
            (account.get('not-exists@account.com') === null).should.be.true;
        });
        it('should not return null when the account is exists', function () {
            var obj = account.get('exists@account.com');
            (obj === null).should.be.false;
            obj.should.be.an.object;
            obj.password.should.be.equal('password');
        })
    });
    afterEach(function () {
        //todo delete 'not-exists@account.com' from db
        //todo delete 'exists@account.com', 'password' into db
    });
});