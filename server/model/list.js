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

	mapOs : function ( callback ){
		var map = function (){
				var match =  this.user_agent.match(/(Mac|Android|iPhone|iPod|Windows)/),
					key = match ? match[0] : 'other',
					value = {
						count : 1
					}
				emit( key, value );
			},
			reduce = function( key, values){
				var obj = {
					count : 0
				}
				values.forEach(function(value){
					obj.count += value.count ;
				});
				return obj;
			};

		this.mapReduce({map:map, reduce: reduce}, callback);
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

Model.mapOs (function(err, logs){
	//console.log(err);
	if(!err){
		//console.log(logs);
	}
});

//Model.findOne({user_agent: });


console.log('init Model:list.js');