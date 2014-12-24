var Env = require('../../model/env.js')
	List = require('../../model/list.js');

module.exports = {
	env: function(req, res) {
		var d = new Date(),
			date = [d.getFullYear(), d.getMonth()+1, d.getDate()-1].join('-'); //先默认取前一天的数据
		Env.getByDate ( date, function(err, data){
			//console.log(err);
			if(!err){
				res.json(data);
			}else{
				console.log(err);
			}
		});
	},
}
