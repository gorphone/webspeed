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
// Use cookie-parser to handle cookie.
var cookieParser = require('cookie-parser'); 
// Use body-parser to pull POST content from HTTP request.
var bodyParser = require('body-parser'); 
// Use Mongoose to connect MongoDB.
var mongoose = require('mongoose');
// Error handler
var mwError = require('./server/middleware/error-handler');
// Define Panda using express
var Panda = express(); 
// Set prot
var port = process.env.PORT || config.port;
// db config
var db = process.env.NAME == 'dev' ? config.db_env : config.db;
console.log(db);
// log config
var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console'
        }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/envs.log', 
            maxLogSize: 1024,
            backups:3,
            category: 'normal' 
        }
    ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

// Trust Nginx
Panda.enable('trust proxy');
// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(db, options);
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


// Configure Panda
Panda.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
Panda.use(cookieParser());
Panda.use(bodyParser.urlencoded({ extended: true }));
Panda.use(bodyParser.json());

Panda.use(express.static('./client'));




/** 
 * REGISTER ROUTES
 * =======================================================
 */
var routerSite = require('./server/router/site');
var routerApi = require('./server/router/api');

Panda.use('/', routerSite);
Panda.use('/api', routerApi, mwError.handle);


/**
 * START PANDA
 * =======================================================
 */
var server = Panda.listen(port, function() {
	console.log('Panda running at %s', server.address().port);
});	

