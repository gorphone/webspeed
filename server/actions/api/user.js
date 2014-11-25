

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
	authentication: function(req, res) {
		var data = req.body;
		if(data){
			var options = 
		}else{

		}
		var user = User.load({}, function() {

		});
		res.json({ message: JSON.stringify(req.body)});
	},
	logout: function(req, res) {

	}
}