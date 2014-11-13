/**
 * The index of Webspeed which was named Panda.
 */
var express = require('express');
var Panda = express();
var port = 1337;
Panda.enable('trust proxy');

var router = express.Router();

//simple logger for this router's requests
//all requests to this router will first hit this middleware
router.use(function(req, res, next) {
	console.log('%s %s - %s', req.method, req.url, req.path);
	next();
});

//this will only be invoked if the path starts with /panda from the mount point
router.use('/panda', function(req, res, next) {
	res.send('panda');
	next();
});

router.use(function(req, res, next) {
	res.send('Webspeed,sfdf daf');
});

Panda.use('/', router);

var server = Panda.listen(port, function() {
	console.log('Panda running at %d', server.address().port);
});	