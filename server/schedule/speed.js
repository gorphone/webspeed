/**
 * 日志切分脚本
 * 访问用户的环境：操作系统，浏览器等等
 *
 */

var mongoose = require('mongoose'),
    //schedule = require('node-schedule'),
    Logs = require('../model/speedLog.js'),
    speedModel = require('../model/speed.js');

// Connect to mongodb
var config = require('../../conf/env.json');
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);



Logs.mapSpeed({
    path: /^\/static\/logger\/pp.gif/
},function(err, logs){
    if(!err){
        console.log(logs.length);
        logs.forEach(function (log) {
            var speed = new speedModel(log.value);
            //console.log(log);

           // speed._id =
            //console.log(speed);

            speed.save(function(err){
                if(err){
                    console.log(err);
                }
                //
            });
        });
    }
});

//env.save();

// var j = schedule.scheduleJob(rule, function(){
//  Logs.mapOs(function(err, logs){
//      // if(!err){
//      //  env.os = logs;
//      //  env.save();
//      // }
//  });
//     console.log('Today is recognized by Rebecca Black!');
// });


