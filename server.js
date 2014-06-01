var port = 18080;
var express = require('express');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var logger = require('./common/logger');
require('./common/mongo');

logger.info('starting app');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride());

var routers = require('./routes/index');

app.use('/api', routers);


app.use(function notFoundHandler(req, res, next) {
    logger.error("request not found", {path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
    res.status(404);
    res.end(req.path + ' not found');
});

app.use(function serverErrorHandler(err, req, res, next) {
    logger.error("request error", {error: err.stack, path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
    if (!err.status) {
        res.status(500);
        res.end('server error');
    }
});

logger.info('accepting request');
app.listen(port);
