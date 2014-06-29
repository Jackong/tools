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

    router.post('/looks/image', multipartMiddleware, function (req, res) {
        res.ok({
            image: req.files.file.path,
            hash: req.files.file.hash
        });
    });

    router.post('/looks',
        router.checker.body('image'),
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
                    if (hash !== req.body.hash) {
                        return callback('invalid image to upload');
                    }
                    callback(null);
                },
                function save(callback) {
                    var look = new Look(
                        {
                            _id: req.body.hash,
                            publisher: uid,
                            image: req.body.image,
                            tags: req.body.tags,
                            description: req.body.description,
                            favorites: [
                                {
                                    _id: req.body.aspect,
                                    wants: [uid]
                                }
                            ]
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
};
/*
 {
 _id: '1',
 publisher: {
 _id: '123',
 nick: 'Daisy',
 avatar: 'http://pic5.duowan.com/iphone/1204/198608807196/198608930535.jpg',
 action: '想要这件上衣',
 time: '刚刚'
 },
 image: 'http://picture-cdn.wheretoget.it/dlm1rc-l-c335x335-shoes-jacket-dress-tank-top-skirt-crop-tops-cute-dress-floral-skirts-flower-dress-classy-blazer.jpg',
 description: '非常漂亮的衣服非常漂亮的衣服非常漂亮的衣服非常漂亮的衣服',
 likes: 22,
 favorites: [
 {
 aspect: '上衣',
 wants: 11,
 tips: 1
 },
 {
 aspect: '内裤',
 wants: 11,
 tips: 1
 }
 ]
 },
 {
 _id: '2',
 publisher: {
 _id: '123',
 nick: 'Daisy',
 avatar: 'http://pic5.duowan.com/iphone/1204/198608807196/198608930535.jpg',
 action: '想要这件上衣',
 time: '刚刚'
 },
 image: 'http://picture-cdn.wheretoget.it/2caz1e-l-c335x335-t-shirt-pants-shoes-sunglasses-jewels-white-yellow-green-pink-flowers-rose-floral-pants-flower-print-floral-summer-jeans-summer-pants-trousers-floral-jeans-skinny-pants-flowered.jpg',
 description: null,
 likes: 22,
 favorites: [
 {
 aspect: '内衣',
 wants: 11,
 tips: 0
 }
 ]
 },
 {
 _id: '3',
 publisher: {
 _id: '123',
 nick: 'Daisy',
 avatar: 'http://pic5.duowan.com/iphone/1204/198608807196/198608930535.jpg',
 action: '想要这件上衣',
 time: '刚刚'
 },
 image: 'http://picture-cdn.wheretoget.it/12yu8h-l-c335x335-skirt-ebony-lace-ebonylace-streetfashion-ebonylace-storenvy-flower-zara-skirt-skort-crisscross-shorts-white-flowers-short-colours-colors-short-skirt-floral-purple-blue-skirt-floral.jpg',
 description: null,
 likes: 22,
 favorites: [
 {
 aspect: '项链',
 wants: 12,
 tips: 0
 }
 ]
 }
 */