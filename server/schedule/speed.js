/**
 * 日志切分脚本
 * 访问用户的环境：操作系统，浏览器等等
 *
 */

var mongoose = require('mongoose'),
    schedule = require('node-schedule'),
    Logs = require('../model/list.js'),
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

var rule = new schedule.RecurrenceRule();
rule.hour = 2; //每天2点跑一次脚本
rule.minute = 0; //每天2点跑一次脚本
// log config
var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console'
        }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/speed.log', 
            maxLogSize: 1024,
            backups:3,
            category: 'normal' 
        }
    ]
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

var j = schedule.scheduleJob(rule, function(){
    var today = new Date();
    var start = new Date( today.getFullYear(), today.getMonth(), today.getDate()-1);
    var end = new Date( today.getFullYear(), today.getMonth(), today.getDate() );
    
    logger.info('running speed start ');
    Logs.mapSpeed({
        access_time: {$gte:start,$lt:end}
    },function(err, logs){
        if(!err){
            var length = logs.length,
                i = 0;
            logger.info( 'result count:' + length );
            if(!length){
                logger.error('empty result');
                return;
            }
            logs.forEach(function (log) {
                var speed = new speedModel(log.value);

                speed.save(function(err){
                    if(err){
                        logger.error('save error', err);
                    }
                    i++;
                    if(i >= length){
                        logger.info('running speed exit ');
                    }
                });
            });
        }else{
            logger.error(err);
        }
    });
});


