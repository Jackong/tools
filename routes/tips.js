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
        router.checker.body('lookId', 'aspect', 'tipId', 'content'),
        function (req, res) {
            var commenter = UserService.getUid(req, res);
            TipService.addComment(commenter, req.body.tipId, req.body.lookId, req.body.aspect, req.body.content, function (err, tip) {
                if (err || !tip) {
                    return res.fail();
                }
                res.ok();
            });
        }
    );

    router.post('/tips',
        router.checker.body('lookId', 'aspect', 'content'),
        function (req, res) {
            var author = UserService.getUid(req, res);
            TipService.addTip(new Tip(
                    {
                        author: author,
                        look: req.body.lookId.toLowerCase(),
                        favorite: req.body.aspect,
                        content: req.body.content
                    }),
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

    router.put('/tips/likes',
        router.checker.body('lookId', 'aspect', 'tipId'),
        function (req, res) {
            var uid = UserService.getUid(req, res);
            var lookId = req.body.lookId;
            var aspect = req.body.aspect;
            var tipId = req.body.tipId;

            TipService.addLike(uid, lookId, aspect, tipId, function (err, num) {
                if (err || 1 !== num) {
                    logger.error('like tips', uid, lookId, aspect, tipId, num, err);
                    return res.fail();
                }
                res.ok();
            });
        }
    );
};