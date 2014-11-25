
var inner = {
	requiresLogin: function(req, res, next) {
		
		next();
	}
}

module.exports = inner;