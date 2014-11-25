

var User = require('./../../model/user');
var utils = require('./../../lib/utils');

module.exports = {
	
	signup: function (req, res, next) {
		var data = {
			username: req.body.username,
			password: req.body.password
		};
		var user = new User(data);
		user.save(function (err) {
			if (err) {
				err = utils.formatDbError(err.errors);
				next(err);
				return;
			} 
			res.json({ message: 'success'});
			//TBD: 计算token，返回
		});
	},

	login: function (req, res, next) {
		var username = req.body.username,
			password = req.body.password
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				err = utils.formatDbError(err.errors);
				next(err);
				return;
			} 
			if (!user.authenticate(password)) {
				next(new Error('密码错误'));
				return;
			}
			var expries = utils.addDaysToCurrentTime(7),
				token = jwts.encode({})

		});
	},

	logout: function (req, res) {

	}
}