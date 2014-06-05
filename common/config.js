/**
 * Created by daisy on 14-6-1.
 */
module.exports = function (what) {
    if (process.env.DEVELOPMENT) {
        var fs = require('fs');
        var path = require('path');
        var dev = '/config/' + what + '.dev.json';
        if (fs.existsSync(path.dirname(__dirname) + dev)) {
            return require('..' + dev);
        }
    }
    return require('../config/' + what + '.json');
};