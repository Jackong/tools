var express = require('express');
var router = express.Router();

require('./before')(router);
require('./users')(router);

module.exports = router;
