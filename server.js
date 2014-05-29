var port = 18080;
var express = require('express');
var logger = require('./common/logger');

logger.info('starting app');

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());


app.get('/api/', function(req, res){
    res.send('hello world');
    logger.info('hello');
});

app.use(function notFoundHandler(req, res, next) {
    logger.error("request not found", {path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
    res.status(404);
    res.end(req.path + ' not found');
});

app.use(function serverErrorHandler(err, req, res, next) {
    logger.error("request error", {error: err, path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
    if (!err.status) {
        res.status(500);
        res.end('server error');
    }
});

logger.info('accepting request');
app.listen(port);
