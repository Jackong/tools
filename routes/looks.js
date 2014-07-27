/**
 * Created by daisy on 14-6-28.
 */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({
    maxFilesSize: 4 * 1024 * 1024,
    hash: 'md5',
    uploadDir: APP_VIEW_DIR + '/images/looks'
});
var async = require('async');

require('../common/mongo');
var logger = require('../common/logger');
var helper = require('../common/helper');
var Look = require('../model/Look');
var LookService = require('../services/Look');
var UserService = require('../services/User');
var Tip = require('../model/Tip');
var TipService = require('../services/Tip');
var FavoriteService = require('../services/Favorite');

var favorites = require('../config/look/favorites');

module.exports = function (router) {

    router.get('/looks/fashion',
        router.checker.query('page'),
        router.checker.query('num'),
        function (req, res) {
            var page = req.query.page;
            var num = req.query.num;
            LookService.getFashion(page * num, num, function (err, looks) {
                res.ok({looks: looks});
            });
        });

    router.get('/looks/favorites', function (req, res) {
        res.ok({favorites: favorites});
    });

    router.post('/looks/:lookId/favorites/:aspect',
        router.checker.params('lookId', 'aspect'),
        function (req, res) {
            var uid = UserService.getUid(req, res);
            var aspect = req.params.aspect;
            var lookId = req.params.lookId;
            LookService.addFavorite(lookId, uid, aspect, function (err, num) {
                if (err || num !== 1) {
                    logger.error('add favorite', uid, lookId, aspect, num, err);
                    return res.fail('哦欧～，操作失败了，请试试吧');
                }
                return res.ok();
            })
        }
    );

    router.post('/looks/image', multipartMiddleware, function (req, res) {
        res.ok({
            image: req.files.file.path.replace(APP_VIEW_DIR, ''),
            hash: req.files.file.hash
        });
    });

    router.put('/looks/:lookId/like',
	router.checker.params('lookId'),
	function(req, res) {
        var uid = UserService.getUid(req, res);
		var lookId = req.params.lookId;
		LookService.like(lookId, uid, function(err) {
			if (err) {
				logger.error('like look failed', err);
				return res.fail('喜欢不了呃。。。再试试呗');
			}
			res.ok();
		});
    });

    router.post('/looks',
        router.checker.body('lookId', 'aspect'),
        function (req, res) {
            var uid = UserService.getUid(req, res);
            async.waterfall([
                function checkAspect(callback) {
                    callback(null);
                },
                function calcHash(callback) {
                    helper.getFileHash(APP_VIEW_DIR + req.body.image, 'md5', callback);
                },
                function checkHash(hash, callback) {
                    if (hash !== req.body.lookId) {
                        return callback('invalid image to upload');
                    }
                    callback(null);
                },
                function save(callback) {
                    var look = new Look(
                        {
                            _id: req.body.lookId,
                            publisher: uid,
                            image: req.body.image,
                            tags: req.body.tags,
                            description: req.body.description,
                            favorites: [req.body.aspect]
                        }
                    );
                    LookService.publish(look,callback);
                }
            ], function (err, look) {
                if (typeof err !== 'undefined' && null !== err) {
                    logger.error('look publish', err);
                    return res.fail('发布失败，请重试');
                }
                res.ok({look: look});
            });

        });
    router.get('/looks/:lookId',
        router.checker.params('lookId'),
        function (req, res) {
            LookService.getDetail(req.params.lookId.toLowerCase(), function (err, look) {
                if (err) {
                    logger.error('get look detail', err);
                    return res.ok({look: null});
                }
                res.ok({look: look});
            });
        }
    );

    router.put('/looks/:lookId/favorites/:aspect/want',
        router.checker.params('lookId', 'aspect'),
        function (req, res) {
            var lookId = req.params.lookId;
            var aspect = req.params.aspect;
            var uid = UserService.getUid(req, res);
            FavoriteService.want(lookId, aspect, uid, function (err, result) {
                if (err) {
                    logger.error('want favorite', lookId, aspect, uid, err);
                    return res.fail('Oh～，要不了呃，再试下吧');
                }
                res.ok();
            });
        }
    );

    router.get('/looks/:lookId/favorites/:aspect/tips/:tipIds',
        router.checker.params('lookId', 'aspect'),
        function (req, res) {
            TipService.getsByIds(req.params.lookId, req.params.aspect, req.params.tipIds.split(','),
                function (err, tips) {
                    if (err) {
                        logger.error('get tips by tips ids', {params: req.params, err: err});
                        res.ok({tips: []});
                    }
                    res.ok({tips: tips});
                }
            );
        }
    );

    router.post('/looks/:lookId/favorites/:aspect/tips',
        router.checker.params('lookId', 'aspect'),
        router.checker.body('content'),
        function (req, res) {
            var author = UserService.getUid(req, res);
            TipService.addTip(new Tip(
                    {
                        author: author,
                        look: req.params.lookId.toLowerCase(),
                        favorite: req.params.aspect,
                        content: req.body.content
                    }),
                function (err, tip) {
                    if (err) {
                        logger.error('add tips', {err: err, params: req.params, body: req.body});
                        return res.fail('Oh，+小贴士失败了');
                    }
                    res.ok({tip: tip});
                }
            );
        }
    );

    router.put('/looks/:lookId/favorites/:aspect/tips/:tipId/comments',
        router.checker.params('lookId', 'aspect', 'tipId'),
        router.checker.body('content'),
        function (req, res) {
            var commenter = UserService.getUid(req, res);
            TipService.addComment(commenter, req.params.tipId, req.params.lookId, req.params.aspect, req.body.content, function (err, tip) {
                if (err || !tip) {
                    return res.fail('Oh，评论提交失败了');
                }
                res.ok({comment: tip.comments[tip.comments.length - 1]});
            });
        }
    );

    router.put('/looks/:lookId/favorites/:aspect/tips/:tipId/likes',
        router.checker.params('lookId', 'aspect', 'tipId'),
        function (req, res) {
            var uid = UserService.getUid(req, res);
            var lookId = req.params.lookId;
            var aspect = req.params.aspect;
            var tipId = req.params.tipId;

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
