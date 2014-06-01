/**
 * Created by daisy on 14-5-30.
 */

var auth = require('../services/auth');

module.exports = function (router) {
    router.post('/account', function (req, res) {
        auth.create(req.body.account, req.body.password, function (err) {
            res.send({ok: null === err});
        });
    });
};