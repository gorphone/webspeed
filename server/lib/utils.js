/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} error
 * @return {Array}
 * @api public
 */
exports.formatDbError = function (error) {
    var keys = Object.keys(error)
    var errs = []
    // if there is no validation error, just display a generic error
    if (!keys) {
        return ['Oops! There was an error']
    }

    keys.forEach(function (key) {
        if (error[key]) errs.push(error[key].message)
    })

    return errs
}

/**
 * 判断一个对象是否为空
 * @param  {JSON}  obj 
 * @return {Boolean}
 * @api public
 */
exports.isEmpty = function (obj) {
    for(var name in obj) {
        return false;
    }
    return true;
};

exports.addDaysToCurrentTime = function (days) {
    return new Date().getTime() + parseInt(days, 10)*24*60*60*1000;
}