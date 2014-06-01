var express = require('express');
var router = express.Router();

require('./account')(router);
require('./users')(router);

module.exports = router;
