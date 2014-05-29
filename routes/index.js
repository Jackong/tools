var express = require('express');
var router = express.Router();

require('./around')(router);
require('./users')(router);

module.exports = router;
