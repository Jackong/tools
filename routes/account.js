/**
 * Created by daisy on 14-5-30.
 */

var auth = require('../services/auth');

module.exports = function (router) {
    router.post('/account', function (req, res) {
        var ok = auth.save(req.body.account, req.body.password);
        res.send({ok: ok});
    });
};