/** 
 * ROUTES FOR PANDA
 * Created on 2014-11-18 by GaoJinghua(gaojinhwa@gmail.com)
 */


var express = require('express');
var list = require('./actions/list.js');

var router = express.Router();

// Route middleware that will happedn on every request.
// The order of middleware and routes is very important.
router.param('food', function(req, res, next, food) {
	
	// output log
	console.log(req.ips, req.method, req.baseUrl+req.url, "want: "+food);
	if(food !== 'xiang'){
		food = 'nothing';
	}
	req.food = food;

	// continue
	next();
});

// Root route
router.get('/', list.index);
router.get('/eat/:food', function(req, res) {
	res.json({ message: 'eating ' + req.food});
});

// More routes can add here


module.exports = router;