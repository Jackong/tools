var winston = require('winston');
var config = require('../config/logger.json');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ level: config.level, filename: config.file})
  ]
});