/**
 * Formats errors
 *
 * @param {String} error_msg
 * @return {JSON}
 * @api public
 */

exports.errors = function (error_msg) {
    var error = {
        'msg': error_msg,
    }
    return error;
};

/**
 * 错误处理
 * @param  {[type]}   err  [description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 * @api public
 */
exports.handle = function (err, req, res, next) {
	//console.log('panda'+JSON.stringify(err));
	if (err) {
		res.json({'message': err});
		//res.send(401);
		return;
	} else {
		next();
	}
};