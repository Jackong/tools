/**
 * Created by daisy on 14-6-2.
 */

var express = require('express');
var logger = require('../common/logger');
var wrap = function (res) {
    res.CODE = {
        OK: 0,
        FAILURE: 1,
        UN_LOGIN: 2
    };

    res.ok = function (data, msg) {
        this.return(this.CODE.OK, msg, data);
    };

    res.fail = function (msg, code) {
        if (!code) {
            code = this.CODE.FAILURE;
        }
        this.return(code, msg);
    };

    res.error = function (err, msg) {
        var code = this.CODE.FAILURE;
        if (null === err) {
            code = this.CODE.OK;
            msg = '';
        }
        this.return(code, msg);
    };

    res.return = function (code, msg, data) {
        this.send({code: code, msg: msg, data: data});
    };
};
wrap(express.response);