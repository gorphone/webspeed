/**
 * 输入验证
 */

var utils = require('./../lib/untils');
var mwError = require('./error-handler');

var inner = {
	verifyPost: function(req, res, next) {
		var data = req.body;
		if(utils.isEmpty(data)){
			var err = mwError.errors('参数为空');
			next(err);
		}else{
			next();
		}
	},
	verifyGet: function(req, res, next) {

	}
}

var outer = {
	
	verify: function(req, res, next) {
		var method  = req.method.toUpperCase();
		//console.log(req);
		switch (method) {
			case "GET":
				inner.verifyGet(req, res, next);
				break;
			case "POST":
				inner.verifyPost(req, res, next);
				break;
			default:
				//TBD
				break;
		}
	}
}

exports.verify = outer.verify;