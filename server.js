var port = 18080;
var express = require('express');
var logger = require('./common/logger');
var app = express();

logger.info('starting app');

app.get('/api/', function(req, res){
  res.send('hello world');
    logger.info('hello');
});

logger.info('accepting request');
app.listen(port);
