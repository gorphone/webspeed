/** 
 * ROUTES FOR PANDA API
 * Created on 2014-11-18 by GaoJinghua(gaojinhwa@gmail.com)
 */


var express = require('express');
var mwAuth = require('./../middleware/authorization');
var mwVerify = require('./../middleware/verification');
var user = require('./../actions/api/user');
var list = require('./../actions/api/list');

var router = express.Router();

router.get('/browser', list.os);

//router.use(bodyParser());

// Route middleware that will happedn on every request.
// The order of middleware and routes is very important.

router.get('/out', mwAuth.requiresLogin, function(req, res) {
	res.json({ message: 'happy'});
});

// Root route
router.post('/eat', function(req, res) {
	res.json({ message: 'eating ' + JSON.stringify(req.body)});
});


router.post('/user/signup', [mwVerify.verify], user.signup);

router.post('/authentication', user.authentication);
// More routes can add here



module.exports = router;