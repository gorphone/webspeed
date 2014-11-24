/** 
 * ROUTES FOR PANDA SITE
 * Created on 2014-11-18 by GaoJinghua(gaojinhwa@gmail.com)
 */


var express = require('express');
var list = require('./../actions/list.js');

var router = express.Router();

// Route middleware that will happedn on every request.
// The order of middleware and routes is very important.


// Root route
router.get('/', list.index);

// More routes can add here


module.exports = router;