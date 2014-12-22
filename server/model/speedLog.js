/* 
* @Author: gaofeng
* @Date:   2014-12-09 15:35:37
* @Last Modified time: 2014-12-15 15:06:30
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    LogSchema = new mongoose.Schema({
        "_id" : Schema.Types.ObjectId,
        "http_x_real_ip" : String,
        "http_client_ip" : String,
        "remote_addr" : String,
        "remote_user" : String,
        "access_time" : Date,
        "http_method" : String,
        "path" : String,
        "http_code" : String,
        "body_bytes_size" : String,
        "referer" : String,
        "user_agent" : String,
        "http_x_forwarded_for" : String,
        "user_id": String
    });



LogSchema.statics = {
    mapSpeed : function ( query, callback ){
        var map = function (){
                var res = {
                        "date" : '',
                        "path" : '', //访问链接
                        "source": '', //数据源，PC、mo
                        "total": { t:0, count:0 },
                        "totalServer": { t:0, count:0 },
                        "serverRedirect": { t:0, count:0 },
                        "serverReady": { t:0, count:0 },
                        "appCache": { t:0, count:0 },
                        "serverDNS": { t:0, count:0 },
                        "serverConnect": { t:0, count:0 },
                        "serverResponse": { t:0, count:0 },
                        "totalDom": { t:0, count:0 },
                        "domTreeInit": { t:0, count:0 },
                        "domReady": { t:0, count:0 },
                        "domContentLoad": { t:0, count:0 },
                        "resourceLoad": { t:0, count:0 },
                        "firstPaint": { t:0, count:0 },
                        "jsLibLoad": { t:0, count:0 },
                        "count": 1
                    };

                var index = this.path.indexOf('?'),
                    query = index > 0 ? this.path.substr(index+1) : '',
                    params = [];

                query = query.split('&');
                query.forEach(function( item ){
                    var i = item.split('=');
                    if( i[0] == 'source' ){
                        res[i[0]] = i[1];
                        return true;
                    }

                    if( res[i[0]] !== undefined && !isNaN(i[1]) && i[1]>0 && i[1] < 10000 ){
                        res[i[0]].t = +i[1];
                        res[i[0]].count = 1;
                    }
                });

                var path = this.referer.replace(/(\w+):\/\/([^\:|\/]+)(\:\d*)?([^#|\?|\n]+)?(#.*)?(\?.*)?/i, '$4');

                path = path.split('/');
                for (var i = 0; i < path.length; i++) {
                    if(path[i].length == 12){
                        path[i] = ':carid';
                    }
                };

                if(path[path.length - 1] == ''){
                    path.splice(path.length - 1);
                }

                path = path.join('/');

                path == '' && ( path = '/' );
                res.path = path;

                var d = new Date(this.access_time);

                res.date = [ d.getFullYear(), d.getMonth(), d.getDate() ].join('-') ;
                
                emit( [res.source,res.path, res.date].join(':'), res );
            },

            reduce = function( key, values){
                var obj = {
                    "date" : '',
                    "path" : '', //访问链接
                    "source": '', //数据源，PC、mo
                    "total": { t:0, count:0 },
                    "totalServer": { t:0, count:0 },
                    "serverRedirect": { t:0, count:0 },
                    "serverReady": { t:0, count:0 },
                    "appCache": { t:0, count:0 },
                    "serverDNS": { t:0, count:0 },
                    "serverConnect": { t:0, count:0 },
                    "serverResponse": { t:0, count:0 },
                    "totalDom": { t:0, count:0 },
                    "domTreeInit": { t:0, count:0 },
                    "domReady": { t:0, count:0 },
                    "domContentLoad": { t:0, count:0 },
                    "resourceLoad": { t:0, count:0 },
                    "firstPaint": { t:0, count:0 },
                    "jsLibLoad": { t:0, count:0 },
                    "count": 0
                }, speedItem = [
                    "total",
                    "totalServer",
                    "serverRedirect",
                    "serverReady",
                    "appCache",
                    "serverDNS",
                    "serverConnect",
                    "serverResponse",
                    "totalDom",
                    "domTreeInit",
                    "domReady",
                    "domContentLoad",
                    "resourceLoad",
                    "firstPaint",
                    "jsLibLoad",
                ];

                values.forEach(function(value){
                    obj.count += value.count;
                    obj.date = value.date;
                    obj.path = value.path;
                    obj.source = value.source;

                    speedItem.forEach(function(v) {
                        obj[v]['t'] +=  value[v]['t'];
                        obj[v]['count'] +=  value[v]['count'];
                    });
                });
                return obj;
            },
            finalize = function(key, obj){
                var speedItem = [
                    "total",
                    "totalServer",
                    "serverRedirect",
                    "serverReady",
                    "appCache",
                    "serverDNS",
                    "serverConnect",
                    "serverResponse",
                    "totalDom",
                    "domTreeInit",
                    "domReady",
                    "domContentLoad",
                    "resourceLoad",
                    "firstPaint",
                    "jsLibLoad",
                ];

                speedItem.forEach(function(v) {
                    obj[v]['count'] && (obj[v]['t'] = (obj[v]['t']/obj[v]['count']).toFixed(3));
                });


                return obj;
            },
            cond = {map:map, reduce: reduce, finalize:finalize};

        if( typeof query == 'function'){
            callback = query;

            query = {user_agent : {$ne: '-'}};
        }

        cond['query'] = query;

        this.mapReduce(cond, callback);
    }
}


var Model = mongoose.model('Webspeed', LogSchema, 'webspeed');
module.exports = Model;

console.log('init speed');

// Model.mapSpeed (function(err, logs){
//  console.log(err);
//  if(!err){
//      console.log(logs);
//  }
// });

// Model.findOne(function(err, logs){
//  console.log(err);
//  if(!err){
//      console.log(logs);
//  }
// });


//Model.findOne({user_agent: });
