

var mongoose = require('mongoose');
var User = require('../../model/user.js');

module.exports = {
	authentication: function(req, res) {
		List.mapOs (function(err, logs){
			console.log(err);
			if(!err){
				res.json(res);
			}
		});
	}
}