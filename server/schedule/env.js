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



var env = new envModel({
		date : new Date( 2014, 11, 17 ),
	});

var start = new Date( 2014, 11, 17);
var end = new Date( 2014, 11, 18 );
// var rule = new schedule.RecurrenceRule();
// rule.second = 0; //每天12点跑一次脚本

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

Logs.mapUserAgent({
        access_time: {$gte:start,$lt:end},
        user_agent : {$ne: '-'}
    },function(err, logs){
	if(!err){
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
				console.log(e);
			}
		});
	}
});

// var j = schedule.scheduleJob(rule, function(){
// 	Logs.mapOs(function(err, logs){
// 		// if(!err){
// 		// 	env.os = logs;
// 		// 	env.save();
// 		// }
// 	});
//     console.log('Today is recognized by Rebecca Black!');
// });


