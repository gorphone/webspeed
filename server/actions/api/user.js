

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
	authentication: function(req, res) {

		res.json({ message: JSON.stringify(req.body)});
	},
	logout: function(req, res) {

	}
}