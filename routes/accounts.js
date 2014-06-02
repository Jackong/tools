/**
 * Created by daisy on 14-5-30.
 */

var auth = require('../services/auth');
var logger = require('../common/logger');

module.exports = function (router) {
    router.route('/accounts')
        .post(router.checker.body('account', 'password'))
        .post(function register(req, res) {
            auth.create(req.body.account, req.body.password, function (err) {
                res.error(err, req);
            });
        });

    router.route('/accounts/:account')
        .put(router.checker.params('account'))
        .put(router.checker.body('password'))
        .put(function updatePassword(req, res) {
            auth.updatePassword(req.params.account, req.body.password, function (err) {
                res.error(err, req);
            });
        });

    router.route('/accounts/:account')
        .get(router.checker.params('account'))
        .get(router.checker.query('password'))
        .get(function login(req, res) {
            auth.get(req.params.account, function (err, account) {
                if (null === account) {
                    return res.fail(req);
                }

                if (req.query.password !== account.password) {
                    return res.fail(req);
                }
                return res.ok();
            });
        });
};