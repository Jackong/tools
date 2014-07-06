/**
 * Created by daisy on 14-6-28.
 */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({
    maxFilesSize: 4 * 1024 * 1024,
    hash: 'md5'
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

var favorites = require('../config/look/favorites');

module.exports = function (router) {

    router.get('/looks/trend',
        router.checker.query('page'),
        router.checker.query('num'),
        function (req, res) {
            var page = req.query.page;
            var num = req.query.num;
            LookService.getTrend(page * num, num, function (err, looks) {
                res.ok({looks: looks});
            });
        });

    router.get('/looks/favorites', function (req, res) {
        res.ok({favorites: favorites});
    });

    router.post('/looks/image', multipartMiddleware, function (req, res) {
        res.ok({
            image: req.files.file.path,
            hash: req.files.file.hash
        });
    });

    router.post('/looks',
        router.checker.body('lookId'),
        router.checker.body('favoriteId'),
        function (req, res) {
            var uid = UserService.getUid(req, res);
            async.waterfall([
                function checkAspect(callback) {
                    callback(null);
                },
                function calcHash(callback) {
                    helper.getFileHash(req.body.image, 'md5', callback);
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
                            favorites: [req.body.favoriteId]
                        }
                    );
                    LookService.publish(look,callback);
                }
            ], function (err, look) {
                if (typeof err !== 'undefined' && null !== err) {
                    logger.error('look publish', err);
                    return res.fail();
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

    router.get('/looks/:lookId/favorites/:favoriteId/tips/:tipIds',
        router.checker.params('lookId'),
        router.checker.params('favoriteId'),
        function (req, res) {
            TipService.getsByIds(req.params.lookId, req.params.favoriteId, req.params.tipIds.split(','),
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