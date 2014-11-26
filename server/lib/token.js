// Use JWTs to authentication which base on token
var jwts = require('jwt-simple');
var config = require('./../../conf/env.json');

/**
 * 生成token
 * @param  {[type]} userid [description]
 * @return {JSON} {token: token, expires: expires}
 */
exports.encode = function (userid) {

    var expires = new Date(Date.now() + 7*24*60*60*1000),
    	token = jwts.encode({
	    	iss: userid,
	    	exp: expires.getTime()
	    }, config.salt);
    return {
    	token: token,
    	expires: expires
    }    
};

exports.decode = function (access_token) {
	var obj = null;
	try {
		obj = jwts.decode(access_token, config.salt);
	} catch (err) {
		console.error('jwts error:',err);
		obj = null;
	}
	return obj;
}

