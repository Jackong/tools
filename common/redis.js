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

client.on('close', function () {
    logger.warn('redis: close and retry connect');
    client = redis.createClient(config.port, config.host, options);
});

client.on("error", function (err) {
    logger.error('redis error:', err.stack);
    client.close();
});

if (config.username && config.password && config.name) {
    client.auth(config.username + '-' + config.password + '-' + config.name);
}