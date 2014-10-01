var port = 80;
global.APP_DIR = __dirname;
global.APP_VIEW_DIR = __dirname + '/view';

var express = require('express');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var system = require('./common/config')('system');
var logger = require('./common/logger');
require('./common/mongo');

logger.info('starting app');

var app = express();
app.use(express.static(APP_DIR + '/view'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(system.salt));
app.use(methodOverride());

var routers = require('./routes/index');

app.use('/api', routers);


app.use(function notFoundHandler(req, res, next) {
    logger.error("request not found", {path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
    res.send(404, req.path + ' not found');
});

app.use(function serverErrorHandler(err, req, res, next) {
    console.log(err);
    logger.error("request error", {error: err.stack, path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
    if (err.status) {
        res.send(err.status, err.message);
    } else {
        res.send(500, 'server error');
    }
});

logger.info('accepting request');
app.listen(port);
