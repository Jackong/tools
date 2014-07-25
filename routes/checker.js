/**
 * Created by daisy on 14-6-1.
 */

var logger = require('../common/logger');

var map = {
    account: /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/,
    password: /^[0-9a-zA-Z]{32}$/,
    page: /^[0-9]+$/,
    num: /^[1-9][0-9]?$/,
    image: /^\/tmp\/.*$/,
    lookId: /^[0-9A-Fa-f]{32}$/,
    aspect: require('../config/look/favorites'),
    tipId: /^[0-9a-fA-F]{24}$/,
    content: /.+/,
    settingType: require('../common/const').SETTING_TYPE
};

var check = function (req, res, next, from, name, defaultValue) {
    var value = req[from][name];
    var required = map[name];
    var ok = false;
    if (required instanceof RegExp) {
        ok = map[name].exec(String(value));
    } else if (required instanceof Object) {
        ok = (required[value] !== undefined);
    }
    if (ok) {
        return ok;
    }
    if (defaultValue) {
        req[from][name] = defaultValue;
        return true;
    }
    var msg = 'invalid param for ' + name;
    logger.error(msg, value);
    res.send(400, msg);
    return false;
};

var checker = function (from) {
    /**
     * @param params with optional default-value to check ({param1:default}, 'param2')
     */
    return function () {
        var args = arguments;
        return function (req, res, next) {
            for(var idx = 0; idx < args.length; idx++) {
                var argv = args[idx];
                if (typeof argv === 'string') {
                    if (!check(req, res, next, from, argv)) {
                        return;
                    }
                    continue;
                }
                for(var name in argv) {
                    if (!check(req, res, next, from, name, argv[name])) {
                        return;
                    }
                }
            }
            next();
        };
    };
};

exports.params = checker('params');
exports.body = checker('body');
exports.query = checker('query');