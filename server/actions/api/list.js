var Env = require('../../model/env.js')
	List = require('../../model/list.js');

module.exports = {
	env: function(req, res) {
		Env.getByDate ( '2014-12-2', function(err, data){
			//console.log(err);
			if(!err){
				res.json(data);
			}else{
				console.log(err);
			}
		});
	},
}
