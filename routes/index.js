var express = require('express');
var router = express.Router();

router.checker = require('./checker');
require('./response');

module.exports = router;
