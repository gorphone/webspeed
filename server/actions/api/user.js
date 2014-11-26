

var User = require('./../../model/user');
var utils = require('./../../lib/utils');
var token = require('./../../lib/token');

module.exports = {
	
	/**
	 * [signup description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
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
			var access_token = token.encode(user.username);
			res.cookie('access_token', access_token.token, {
				expires: access_token.expires, 
				path: '/'
			});
			res.json(access_token);
		});
	},

	/**
	 * [login description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	login: function (req, res, next) {
		var username = req.body.username,
			password = req.body.password
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				err = utils.formatDbError(err.errors);
				next(err);
				return;
			} 
			if (utils.isEmpty(user)) {
				next('用户不存在！');
				return;
			}

			if (!user.authenticate(password)) {
				next('密码错误！');
				return;
			}
			var access_token = token.encode(user.username);
			res.cookie('access_token', access_token.token, {
				expires: access_token.expires, 
				path: '/'
			});
			res.json(access_token);
		});
	},

	/**
	 * [logout description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	logout: function (req, res) {
		res.clearCookie('access_token');
		res.json({"message": ""});
	}
}