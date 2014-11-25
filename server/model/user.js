/**
 * USER
 * Created on 2014-11-14 by GaoJinghua(gaojinhwa@gmail.com)
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('./../../conf/env.json');

var Schema = mongoose.Schema;


/**
 * userSchema
 * @type {Schema}
 */
var userSchema = new Schema({
	username: { type: String, default: ''},
	hashed_password: { type: String, default: ''},
	group: { type: String, default: ''}
});

/**
 * Virtual property 
 */
userSchema.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = config.salt;
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
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
	authenticate: function(plainPasswd) {
		return this.encryptPassword(plainPasswd) === this.hashed_password;
	},
	/**
	 * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
	 */
	encryptPassword: function(password) {
		if(!password) return '';
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
   /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}


module.exports = mongoose.model('User', userSchema);
