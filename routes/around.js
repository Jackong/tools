/**
 * Created by daisy on 14-5-29.
 */

var logger = require('../common/logger');

module.exports = function logAccess(router) {
    router.use(function (req, res, next) {
        var start = new Date().getTime();
        next();
        logger.info('access',
            {
                method: req.method
                ,path: req.path
                ,status: res.statusCode
                ,length: res.get('Content-Length')
                ,time: new Date().getTime() - start
                ,ip: req.ip
                ,userAgent: req.header('User-Agent')
            });
    });
};