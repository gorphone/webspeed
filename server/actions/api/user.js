

var mongoose = require('mongoose');
var User = require('../../model/user.js');

module.exports = {
	authentication: function(req, res) {

		var data = req.body;
		
		res.json({ message: JSON.stringify(req.body)});
	},
	signup: function(req, res, next) {
		console.log('xxx');
		res.json({ message: 'success'});
	},
	logout: function(req, res) {
	}
}