var List = require('../../model/list.js');

module.exports = {
	os: function(req, res) {
		List.mapOs (function(err, logs){
			//console.log(err);
			if(!err){
				res.json(res);
			}else{
				next(err);
			}
		});
		//res.json({ message: JSON.stringify(req.body)});
	},
}