/**
 * The index of Webspeed which was named Panda.
 * Created on 2014-11-14 by GaoJinghua(gaojinhwa@gmail.com)
 */


/**
 * BASE SETUP
 * ==================================================
 */
var config = require('./conf/env.json');
// Framework
var express = require('express'); 
console.log(express);exit();
// Use morgan to console log
// var morgan = require('morgan');
// Use body-parser to pull POST content from HTTP request.
var bodyParser = require('body-parser'); 
// Use csurf for CSRF
//var csrf = require('csurf');
// Use Mongoose to connect MongoDB.
var mongoose = require('mongoose');
var csrf = require('csurf');

// Define Panda using express
var Panda = express(); 
// Set prot
var port = config.port;
// Trust Nginx
Panda.enable('trust proxy');

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

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