var path = require('path');
module.exports = {
	index : function  ( req, res ) {
		//res.send('hello,world');
		res.sendfile('client/index.html');
	}
}