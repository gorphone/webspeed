
/**
 * 判断一个对象是否为空
 * @param  {JSON}  obj 
 * @return {Boolean}
 * @api public
 */
exports.isEmpty = function(obj) {
    for(var name in obj) {
        return false;
    }
    return true;
};