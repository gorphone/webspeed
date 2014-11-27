/**
 * 权限验证
 */

var utils = require('./../lib/utils');
var token = require('./../lib/token');

var outer = {

	verify: function (req, res, next) {
		var access_token = req.headers['x-access-token']
			|| (req.query && req.query.access_token) 
			|| (req.body && req.body.access_token)
			|| (req.cookie && req.cookie.access_token);

		if (utils.isEmpty(access_token)) {
			next('没有权限');
			return;
		}
		var decoded_token = token.decode(access_token);
		if (decoded_token.exp < Date.now()){
			next('token已过期');
			return;
		} 
		if (decoded_token.iss !== 'panda') {
			next('没有权限');
			return;
		}

		next();
	}
}

exports.verify = outer.verify;