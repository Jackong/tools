/**
 * Created by daisy on 14-5-29.
 */

var logger = require('../common/logger');
require('../common/mongo');
var UserService = require('../services/User');
module.exports = function users(router) {
    router.get('/users', function getUser(req, res) {
	    var uid = UserService.getUid(req, res);
	    UserService.getUserInfo(uid, function(err, user) {
	    	if (err || !user) {
			logger.error('get user info fail', err);
			return res.fail();
		}
		res.ok();
	    });
    });
};
