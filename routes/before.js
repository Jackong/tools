/**
 * Created by daisy on 14-5-29.
 */
var logger = require('../common/logger');

module.exports = function log(router) {
    router.use(function (req, res, next) {
        logger.info('', {method: req.method, path: req.path, ip: req.ip, userAgent: req.header('User-Agent')});
        next();
    });
};