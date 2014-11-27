/**
 * 日志切分脚本
 * 访问用户的环境：操作系统，浏览器等等
 *
 */

var mongoose = require('mongoose'),
	schedule = require('node-schedule'),
	Logs = require('../model/list.js');

var Schema = mongoose.Schema,
	envSchema = new mongoose.Schema({
	    'date' : Date,
	    'os' : [{
	    	'name': String,
	    	'version' : String,
	    	'platform' : String,
	    	'count': Number
	    }],
	    'browser': [{
	    	'name': String,
	    	'version' : String,
	    	'platform' : String,
	    	'count' : Number
	    }]
	});

var envModel = mongoose.model('env', envSchema),
	env = new envModel({
		date : new Date,
		os : [{
			name:'test',
			version:'test',
			platform:'test',
			count:1
		}],
		browser : [{
			name:'test',
			version:'test',
			platform:'test',
			count:1
		}],
	});

envModel.insert({
		date : new Date,
		os : [{
			name:'test',
			version:'test',
			platform:'test',
			count:1
		}],
		browser : [{
			name:'test',
			version:'test',
			platform:'test',
			count:1
		}],
	});
// console.log(env.id);

// // var rule = new schedule.RecurrenceRule();
// // rule.second = 0; //每天12点跑一次脚本

// console.log(env);

// env.save(function(err){
// 	console.log(err);
// });

// var j = schedule.scheduleJob(rule, function(){
// 	Logs.mapOs(function(err, logs){
// 		// if(!err){
// 		// 	env.os = logs;
// 		// 	env.save();
// 		// }
// 	});
//     console.log('Today is recognized by Rebecca Black!');
// });


