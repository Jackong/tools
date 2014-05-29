var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.send('hi');
});

router.get('/users', function(req, res) {
	res.send({name:'jack', age:12});
});

module.exports = router;
