/**
 * Created by daisy on 14-5-29.
 */

var logger = require('../common/logger');
require('../common/mongo');
var mongoose = require('mongoose');

var TestSchema = mongoose.Schema({
    test: {type: String, lowercase: true, trim: true},
    test2: String,
    test3: [
        {
            a: String,
            b: Number,
            c: [{type: Number}]
        }
    ]
});
var Test = mongoose.model('Test', TestSchema);

module.exports = function users(router) {
    router.get('/users', function users(req, res) {
        console.log('mongo');
        var test = new Test({test: 'jack'});
        console.log(test);
        test.save(function (err, doc) {
            console.log(err);
            console.log(doc);
            res.send({name:'jack', sex:'male'});
        });
        console.log('ok');
    });

    router.get('/tests', function (req, res) {
        Test.find({test: 'jack'}, function (err, docs) {
            res.send({err: err, docs: docs, some: 'some2'});
        });
    })
};
