var express = require('express');
var router = express.Router();

router.checker = require('./checker');
require('./response');

require('./accounts')(router);
require('./looks')(router);
require('./favorites')(router);
require('./tips')(router);
require('./users')(router);

module.exports = router;
