/**
 * Created by daisy on 14-5-30.
 */
var async = require('async');
var request = require('request');

require('../common/mongo');

var oauth = require('../common/config')('oauth');

var User = require('../model/User');
var UserService = require('../services/User');

var logger = require('../common/logger');
var helper = require('../common/helper');
var AUTH_PLATFORM = require('../common/const').AUTH_PLATFORM;

module.exports = function (router) {
    router.get('/social/oauth/callback', function (req, res) {
        var options = {
            url: oauth.tokenUrl,
            method: 'POST',
            json: true,
            form: {
                grant_type: oauth.grantType,
                client_id: oauth.apiKey,
                client_secret: oauth.secretKey,
                redirect_uri: 'http://192.168.59.103/api/social/oauth/callback',
                code: req.query.code
            }
        };
        request(options, function (err, response, body) {
            if (err || response.statusCode != 200 || body.error_code) {
                logger.error('social callback', err, body);
                return res.redirect('/');
            }
            var platform = null;
            switch (body.media_type) {
                case 'qqdenglu':
                    platform = AUTH_PLATFORM.QQ;
                    break;
                case 'sinaweibo':
                    platform = AUTH_PLATFORM.SINA;
                    break;
                case 'baidu':
                    platform = AUTH_PLATFORM.BAIDU;
                    break;
            }
            if (platform === null) {
                logger.error('media type not support', body);
                return res.redirect('/');
            }
            UserService.sync(platform, body.media_uid, body.access_token, body.name, body.expires_in, function (err, uid) {
                if (err) {
                    logger.error('sync platform info fail', body);
                } else {
                    UserService.login(uid, req, res);
                }
                res.redirect('/');
            });
        })
    });

    router.get('/accounts/check',
        function checkLogin(req, res) {
            var uid = UserService.getUid(req, res);
            if (uid) {
                return res.ok();
            }
            return res.fail();
        });
};
