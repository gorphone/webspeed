/**
 * 权限验证
 */

var inner = {
	requiresLogin: function(req, res, next) {
		
		next();
	}
}

module.exports = inner;