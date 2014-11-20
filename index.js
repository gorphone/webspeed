/**
 * The index of Webspeed which was named Panda.
 * Created on 2014-11-14 by GaoJinghua(gaojinhwa@gmail.com)
 */


/**
 * BASE SETUP
 * ==================================================
 */
var config = require('./conf/env.json');
var fs = require('fs');
// Framework
var express = require('express'); 
// Use body-parser to pull POST content from HTTP request.
var bodyParser = require('body-parser'); 
// Use Mongoose to connect MongoDB.
var mongoose = require('mongoose');
// Use JWTs to authentication which base on token
var jwToken = require('jwt-simple');
// Define Panda using express
var Panda = express(); 
// Set prot
var port = process.env.PORT || config.port;
// Trust Nginx
Panda.enable('trust proxy');
// set salt
Panda.set('jwtTokenSecret', config.salt);

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

/**
 * BOOTSTRAP MODELS
 * ==================================================
 */
fs.readdirSync(__dirname + '/server/model').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/server/model/' + file);
});

// Configure Panda to use bodyParser()
Panda.use(bodyParser.urlencoded({ extended: true }));
Panda.use(bodyParser.json());

/** 
 * REGISTER ROUTES
 * Set all of routes will be prefixed with /api
 * =======================================================
 */
var router = require('./server/router.js');

Panda.use('/api', router);


/**
 * START PANDA
 * =======================================================
 */
var server = Panda.listen(port, function() {
	console.log('Panda running at %s', server.address().port);
});	