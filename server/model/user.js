/**
 * USER
 * Created on 2014-11-14 by GaoJinghua(gaojinhwa@gmail.com)
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('./../../conf/env.json');
/**
 * userSchema
 * @type {Model}
 */
var userSchema = new mongoose.Schema({
	username: { type: String, default: ''},
	hashed_password: { type: String, default: ''},
	group: { type: String, default: ''}
});

/**
 * Virtual property 
 */
userSchema.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = config.salt;
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

/**
 * Validations
 * @param  {String} value
 * @return {Boolean}
 */
var validatePresenceOf = function (value) {
	return value && value.length;
};

userSchema.path('username').validate(function (username, fn) {
	var User = mongoose.model('User');
	// Check only when it is a new user or when username field is modified
	if (this.isNew || this.isModified('username')) {
		User.find({ username: username }).exec(function (err, users) {
			fn(!err && users.length === 0);
		});
	} else {
		fn(true);
	}
}, '用户已存在');

userSchema.path('hashed_password').validate(function (hashed_password) {
	return hashed_password.length;
}, '密码为空');

/**
 * Pre-save hook
 */

userSchema.pre('save', function (next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password)) {
		next(new Error('密码为空'));
	} else {
		next();
	}
});

/**
 * Entity methods
 */
userSchema.methods = {
	/**
	 * Authenticate: check if the passwords are the same
	 * 
	 * @param  {String} plainPasswd
	 * @return {Boolen}
	 * @api public
	 */
	authenticate: function (plainPasswd) {
		return this.encryptPassword(plainPasswd) === this.hashed_password;
	},
	/**
	 * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
	 */
	encryptPassword: function (password) {
		if (!password) return '';
		try {
			return crypto
				.createHmac('sha1', this.salt)
				.update(password)
				.digest('hex');
		} catch (err) {
			return '';
		}
	}
}

/**
 * Model methods
 */

userSchema.statics = {
	
}


module.exports = mongoose.model('User', userSchema);