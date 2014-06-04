/**
 * Created by daisy on 14-6-3.
 */
require('should');

describe('json', function () {
    describe('.parse()', function () {
        it('should throw expection when data is not json string', function () {
            JSON.parse.bind(null, 'aaa').should.throw(/^Unexpected token/);
        });

        it('should not throw expection when data is null', function () {
            var js = JSON.parse(null);
            (null === js).should.true;
        });
    });
});
