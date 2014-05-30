/**
 * Created by daisy on 14-5-30.
 */

var account = require('../services/account');

module.exports = function (router) {
    router.post('/account', function (req, res) {
        var ok = account.save(req.body.account, req.body.password);
        res.send({ok: ok});
    });
};