/**
 * Created by daisy on 14-6-28.
 */

var logger = require('../common/logger');
var LookService = require('../services/Look');
var UserService = require('../services/User');

module.exports = function (router) {

    router.route('/looks/trend')
        .get(router.checker.query('page'))
        .get(router.checker.query('num'))
        .get(function (req, res) {
            var page = req.query.page;
            var num = req.query.num;
            LookService.getTrend(page * num, num, function (err, looks) {
                res.ok({looks: looks});
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