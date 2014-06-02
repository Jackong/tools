/**
 * Created by daisy on 14-6-2.
 */

var express = require('express');
var logger = require('../common/logger');
var wrap = function (res) {
    res.CODE = {
        OK: 0,
        FAILURE: 1
    };

    res.ok = function () {
        this.return(this.CODE.OK);
    };

    res.error = function (err, req) {
        var isOk = (null === err);
        if (!isOk) {
            logger.error('route failure', {error: err.message, path: req.path, method: req.method, ip:req.ip, userAgent: req.headers['user-agent']});
        }
        this.return(isOk ? this.CODE.OK : this.CODE.FAILURE);
    };

    res.return = function (code, msg) {
        this.send({code: code, msg: msg});
    };
};
wrap(express.response);