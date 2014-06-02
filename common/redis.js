/**
 * Created by daisy on 14-6-2.
 */
var redis = require('redis');
var config = require('./config')('redis');
var logger = require('./logger');

var options = {
    no_ready_check: true
};

var client = module.exports = redis.createClient(config.port, config.host, options);

client.on("error", function (err) {
    logger.error('redis error:', err.stack);
    logger.warn('redis: retry connect');
    client = redis.createClient(config.port, config.host, options);
});

if (config.username && config.password && config.name) {
    client.auth(config.username + '-' + config.password + '-' + config.name);
}

client.PREFIX = {
    ACCOUNT_FORGOT: 'account:forgot:'
};