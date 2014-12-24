/**
 * 日志切分脚本
 * 访问用户的环境：操作系统，浏览器等等
 *
 */

var mongoose = require('mongoose'),
	schedule = require('node-schedule'),
	Logs = require('../model/list.js'),
	envModel = require('../model/env.js');

// Connect to mongodb
var config = require('../../conf/env.json');
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);


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

var rule = new schedule.RecurrenceRule();
rule.hour = 2; //每天2点跑一次脚本


function schemaValue(log){
	var browser = [],
		os = [];
	for (var i in log.value.browser) {
		var version = [],
			b = log.value.browser[i];
		for(var j in b.version ){
			version.push({
				version: j,
				count: b.version[j].count
			});
		}
		browser.push({
			name: i,
			count: b.count,
			version: version
		});
	};
	for (var i in log.value.os) {
		var version = [],
			b = log.value.os[i];
		for(var j in b.version ){
			version.push({
				version: j,
				count: b.version[j].count
			});
		}
		os.push({
			name: i,
			count: b.count,
			version: version
		});
	};

	return {
		os: os,
		browser: browser
	}
}



logger.info('running envs start ');
var j = schedule.scheduleJob(rule, function(){
	//runing task
	var today = new Date();
	var start = new Date( today.getFullYear(), today.getMonth(), today.getDate()-1);
	var end = new Date( today.getFullYear(), today.getMonth(), today.getDate() );

	var env = new envModel({
		date : start,
	});

    Logs.mapUserAgent({
        access_time: {$gte:start,$lt:end},
        user_agent : {$ne: '-'}
	},function(err, logs){
		if(!err){
			logger.info('map success');
			logs.forEach(function (log) {
				var v = schemaValue(log);
				console.log(log);
				env[log._id] ={
					os: v.os,
					browser : v.browser,
					count : log.value.count
				}; 
			});

			env.save(function(e){
				if(e) {
					logger.error(e);
				}
			});
		}else{
			logger.error(err);
		}
	});
});


