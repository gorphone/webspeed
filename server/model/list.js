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
    "request_time" : String,
    "log_id" : String
});



LogSchema.statics = {
	findOs : function  ( os , callback ) {
		this.find({user_agent: new RegExp(os,'i')}, callback);
	},

	findOsCount : function  ( os , callback ) {
		this.find({user_agent: new RegExp(os,'i')}).count(callback);
	},

	mapUserAgent : function ( query, callback ){
		var map = function (){
				var	key = 'mo',
					res = {
						os : 'other',
						o_version : 'other',
						browser : 'other',
						b_version : 'other',
						count : 1
					},
					user_agent = this.user_agent,
					browser = ['MSIE','Chrome','Firefox','UCWEB','UCBrowser', 'Opera','Maxthon','TencentTraveler','360SE', "MQQBrowser", "MicroMessenger",'baidubrowser','BIDUBrowser','Safari'],
					mo = ["Android", "iPhone OS", "iPod", "iPad", "Windows Phone","SymbianOS","BlackBerry",'Ucmobile'],
					pc = ["Windows NT", "Mac", "Linux","X11", "Java"];

				for (var i = 0, n=mo.length; i < n; i++) {
					if( user_agent.indexOf(mo[i]) > -1){
						res.os = mo[i];

						var reg = new RegExp( mo[i] + "\\\/?\\s*([\\d\\._]+)"),
							match = reg.exec(user_agent);

						if( match && match[1]){
							res.o_version = match[1];
						}

						break;
					}
				};


				if(res.os == 'other'){
					key = 'pc';
					for (var i = 0, n=pc.length; i < n; i++) {
						if( user_agent.indexOf(pc[i]) > -1){
							res.os = pc[i];

							var reg = new RegExp( pc[i] + "\\\/?\\s*([\\d\\.]+)"),
								match = reg.exec(user_agent);

							if( match && match[1]){
								res.o_version = match[1];
							}

							break;
						}
					}
				}
				

				for (var i = 0, n=browser.length; i < n; i++) {
					if( user_agent.indexOf(browser[i]) > -1){
						res.browser = browser[i];

						var reg = new RegExp( browser[i] + "\\\/?\\s*([\\d\\.]+)"),
							match = reg.exec(user_agent);

						if( match && match[1]){
							res.b_version = match[1];
						}

						break;
					}
				};
				
				emit( key, res );
			},

			reduce = function( key, values){
				var obj = {
					os: {},
					browser : {},
					count : 0
				};
				values.forEach(function(value){
					obj.count += value.count ;
					//obj.str.push( JSON.stringify(value));
					obj.time +=1;

					//
					// * 处理操作系统
					//
					//如果是对象，则merge
					if( typeof value.os == 'object' ){
						for(var i in value.os){
							if(!obj['os'][i]){
								obj['os'][i] = {count:0, version : {}};
							}

							obj['os'][i]['count'] += value['os'][i]['count']

							for (var j in value['os'][i]['version'] ) {
								if( !obj['os'][i]['version'][j] ){
									obj['os'][i]['version'][j] = { count:0 };
								}

								obj['os'][i]['version'][j]['count'] += value['os'][i]['version'][j]['count'];
							};
						}
					}else{  //单个对象，

						if(!obj.os[value.os]){
							obj.os[value.os] = { count: 0, version: {} };
						}
						obj.os[value.os].count += value.count ;
						if(!obj['os'][value.os]['version'][value.o_version]){
							obj.os[value.os]['version'][value.o_version] = { count:0 };
						}
						obj.os[value.os]['version'][value.o_version]['count'] += value.count ;
					}

					//
					// * 处理浏览器
					// 
					if( typeof value.browser == 'object' ){
						for(var i in value.browser){
							if(!obj['browser'][i]){
								obj['browser'][i] = {count:0, version : {}};
							}

							obj['browser'][i]['count'] += value['browser'][i]['count']

							for (var j in value['browser'][i]['version'] ) {
								if( !obj['browser'][i]['version'][j] ){
									obj['browser'][i]['version'][j] = { count:0 };
								}

								obj['browser'][i]['version'][j]['count'] += value['browser'][i]['version'][j]['count'];
							};
						}
					}else{  //单个对象，

						if(!obj.browser[value.browser]){
							obj.browser[value.browser] = { count: 0, version: {} };
						}
						obj.browser[value.browser].count += value.count ;
						if(!obj['browser'][value.browser]['version'][value.b_version]){
							obj.browser[value.browser]['version'][value.b_version] = { count:0 };
						}
						obj.browser[value.browser]['version'][value.b_version]['count'] += value.count ;
					}

				});
				return obj;
			},
			cond = {map:map, reduce: reduce};

		if( typeof query == 'function'){
			callback = query;

			query = {user_agent : {$ne: '-'}};
		}

		cond['query'] = query;

		this.mapReduce(cond, callback);
	}
}

// db.runCommand({"group" : {
// 	"ns" : "web00",
// 	"$keyf" : function(doc){
// 		var match =  doc.user_agent.match(/(Android|iPhone)/);
// 		return {"user_agent" : match ? match[0] : 'other'};
// 	},
// 	"initial" : {"count" : 0},
// 	"$reduce" : function(doc, prev){
//         prev.count ++;
//     }
// }});
var Model = mongoose.model('web00', LogSchema);
module.exports = Model;

// Model.mapUserAgent (function(err, logs){
// 	console.log(err);
// 	if(!err){
// 		console.log(logs);
// 	}
// });

//Model.findOne({user_agent: });


console.log('init Model:list.js');
