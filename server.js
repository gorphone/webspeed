/**
 * The index of Webspeed which was named Panda.
 * Created on 2014-11-14 by GaoJinghua(gaojinhwa@gmail.com)
 */


/**
 * BASE SETUP
 * ==================================================
 */
var conf = require('./conf/env.json');
// Framework
var express = require('express'); 

// Define Panda using express
var Panda = express(); 
// Set prot
var port = conf.port;
// Trust Nginx
Panda.enable('trust proxy');

// Use body-parser to pull POST content from HTTP request.
var bodyParser = require('body-parser'); 
// Configure Panda to use bodyParser()
Panda.use(bodyParser.urlencoded({ extended: true }));
Panda.use(bodyParser.json());

// Use Mongoose to connect MongoDB.
var mongoose = require('mongoose');
//mongoose.connect('')


/** 
 * ROUTES FOR PANDA
 * ======================================================
 */
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
router.get('/', function(req, res) {
	res.json({ message: 'Miao~, welcome to Panda!'});
});
router.get('/eat/:food', function(req, res) {
	res.json({ message: 'eating ' + req.food});
});

// More routes for Panda will happen here


/** 
 * REGISTER ROUTES
 * Set all of routes will be prefixed with /api
 * =======================================================
 */
Panda.use('/api', router);


/**
 * START PANDA
 * =======================================================
 */
var server = Panda.listen(port, function() {
	console.log('Panda running at %s', server.address().port);
});	