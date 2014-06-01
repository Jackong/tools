/**
 * Created by daisy on 14-5-30.
 */

var auth = require('../services/auth');
var logger = require('../common/logger');

module.exports = function (router) {
    router.route('/account')
        .post(router.checker.body('account', 'password'))
        .post(function (req, res) {
            auth.create(req.body.account, req.body.password, function (err) {
                res.send({ok: null === err});
            });
        });
};