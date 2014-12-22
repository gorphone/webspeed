/** 
 * ROUTES FOR PANDA API
 * Created on 2014-11-18 by GaoJinghua(gaojinhwa@gmail.com)
 */


var express = require('express');
var mwAuth = require('./../middleware/authorization');
var mwVerify = require('./../middleware/verification');
var user = require('./../actions/api/user');
var list = require('./../actions/api/list');
var speed = require('./../actions/api/speed');

var router = express.Router();

router.get('/env', list.env);
router.get('/speed', speed.speed);
router.get('/pages', speed.pages);

//router.use(bodyParser());

// Route middleware that will happedn on every request.
// The order of middleware and routes is very important.

router.post('/user/login', [mwVerify.verify], user.login);
router.post('/user/signup', [mwVerify.verify], user.signup);

router.post('/user/logout', [mwAuth.verify], user.logout);
// More routes can add here



module.exports = router;
