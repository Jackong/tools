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
        router.checker.body('lookId', 'favoriteId', 'tipId', 'content'),
        function (req, res) {
            var commenter = UserService.getUid(req, res);
            TipService.addComment(commenter, req.body.tipId, req.body.lookId, req.body.favoriteId, req.body.content, function (err, comment) {
                if (err) {
                    return res.fail();
                }
                res.ok({comment: comment});
            });
        }
    );

    router.post('/tips',
        router.checker.body('lookId', 'favoriteId', 'content'),
        function (req, res) {
            var author = UserService.getUid(req, res);
            TipService.addTip(new Tip(
                    {
                        author: author,
                        look: req.body.lookId.toLowerCase(),
                        favorite: req.body.favoriteId,
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
};