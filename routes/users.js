/**
 * Created by daisy on 14-5-29.
 */

module.exports = function users(router) {
    router.get('/users', function users(req, res) {
        res.send({name:'jack', sex:'male'});
    });
};