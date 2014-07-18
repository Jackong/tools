/**
 * Created by daisy on 14-7-18.
 */
require('../common/mongo');
var logger = require('../common/logger');
var UserService = require('../services/User');
var FavoriteService = require('../services/Favorite');

module.exports = function (router) {
    router.put('/favorites/want',
        router.checker.body('lookId', 'aspect'),
        function (req, res) {
            var lookId = req.body.lookId;
            var aspect = req.body.aspect;
            var uid = UserService.getUid(req, res);
            FavoriteService.want(lookId, aspect, uid, function (err, result) {
                if (err) {
                    logger.error('want favorite', lookId, aspect, uid, err);
                    return res.fail();
                }
                res.ok();
            });
        }
    );
};