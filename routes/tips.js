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
        router.checker.body('tipId'),
        router.checker.body('content'),
        function (req, res) {
            var commenter = UserService.getUid(req, res);
            TipService.addComment(commenter, req.body.tipId, req.body.content, function (err, comment) {
                if (err) {
                    return res.fail();
                }
                res.ok({comment: comment});
            });
        }
    );

    router.post('/tips',
        router.checker.body('lookId'),
        router.checker.body('favoriteId'),
        router.checker.body('content'),
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