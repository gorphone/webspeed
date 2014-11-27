var List = require('../../model/list.js');

module.exports = {
	os: function(req, res) {
		List.mapOs (function(err, logs){
			//console.log(err);
			if(!err){
				res.json(logs);
			}else{
				console.log(err);
			}
		});
	},
}