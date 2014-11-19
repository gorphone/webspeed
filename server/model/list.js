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
	}
}


module.exports = mongoose.model('web00', LogSchema);

// Model.findOsCount ('Android', function(err, logs){
// 	if(!err){
// 		console.log(logs[0]);
// 	}
// });

//Model.findOne({user_agent: });


console.log('init Model:list.js');