/**
 * Created by daisy on 14-7-6.
 */
require('../common/mongo');
var logger = require('../common/logger');
var helper = require('../common/helper');
var Tip = require('../model/Tip');
var TipService = require('../services/Tip');
var UserService = require('../services/User');

module.exports = function (router) {
    router.put('/tips/comments',
        function (req, res) {
            res.fail();
        }
    );

    router.post('/tips',
        router.checker.body('lookId'),
        router.checker.body('favoriteId'),
        function (req, res) {
            var author = UserService.getUid(req, res);
            TipService.addTip(req.body.lookId.toLowerCase(),
                req.body.favoriteId, new Tip({author: author, content: req.body.content}),
                function (err, tip) {
                    if (err) {
                        logger.error('add tips', {err: err, params: req.body});
                        return res.fail();
                    }
                    res.ok({tip: tip});
                }
            );
        }
    );
};