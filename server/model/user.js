/**
 * USER
 * Created on 2014-11-14 by GaoJinghua(gaojinhwa@gmail.com)
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// User Schema
var UserSchema = new Schema({
	username: { type: String, default: ''},
	password: { type: String, default: ''},
	group: { type: String, default: ''}
});

/**
 * Entity methods
 */
UserSchema.methods = {
	/**
	 * Authenticate: check if the passwords are the same
	 * @param  {String} plainPasswd
	 * @return {Boolen}
	 */
	authenticate: function(plainPasswd) {
		console.log('entity');
	}
}

/**
 * Model methods
 */

UserSchema.statics = {
	authenticate: function() {
		console.log('model');
	}
}

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
