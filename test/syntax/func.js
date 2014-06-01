/**
 * Created by daisy on 14-6-1.
 */
require('should');

describe('func', function () {
   it('should be append a func to a object', function () {
       var obj = {};
       obj.dynamic = function (param) {
           return param + 1;
       };
       obj.dynamic(0).should.be.equal(1);
       obj.dynamic(1).should.be.equal(2);
       obj.dynamic(-1).should.be.equal(0);
   })
});