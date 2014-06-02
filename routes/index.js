var express = require('express');
var router = express.Router();

router.checker = require('./checker');
require('./response');

require('./account')(router);
require('./users')(router);

module.exports = router;
