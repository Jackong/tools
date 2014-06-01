/**
 * Created by daisy on 14-6-1.
 */
module.exports = function (what) {
    var config = require('../config/' + what + '.json');
    if (process.env.DEVELOPMENT) {
        return config.dev;
    }
    return config.prod;
};