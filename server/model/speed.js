/* 
* @Author: gaofeng
* @Date:   2014-12-08 17:02:13
* @Last Modified time: 2014-12-15 16:00:46
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    speedSchema = new mongoose.Schema({
        "date" : Date,
        "path" : String, //访问链接
        "source": String, //数据源，PC、mo
        "total": {count: Number, t: Number},
        "totalServer": {count: Number, t: Number},
        "serverRedirect": {count: Number, t: Number},
        "serverReady": {count: Number, t: Number},
        "appCache": {count: Number, t: Number},
        "serverDNS": {count: Number, t: Number},
        "serverConnect": {count: Number, t: Number},
        "serverResponse": {count: Number, t: Number},
        "totalDom": {count: Number, t: Number},
        "domTreeInit": {count: Number, t: Number},
        "domReady": {count: Number, t: Number},
        "domContentLoad": {count: Number, t: Number},
        "resourceLoad": {count: Number, t: Number},
        "firstPaint": {count: Number, t: Number},
        "jsLibLoad": {count: Number, t: Number},
        "count": Number
    },{autoIndex:true}),
    speedModel;

speedSchema.statics = {
    /**
     * getPage
     * @param  {Object}   options  {
     *     
     * }
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getSpeedOfPage: function ( options , callback) {
        var options = options || {},
            cond = {};
        cond.source = options.platform || 'mo';
        cond.path = options.page;

        if (options.start || options.end){
            cond.date = {};
            options.start && ( cond.date.$gte = options.start + '0:00:00' );
            options.start && ( cond.date.$lte = options.start + '23:59:59' );
        }

        this.find( cond , callback)
    },

    getPages : function ( callback ){
        this.aggregate().match({count:{$gt:10}}).group({
                _id:  "$source",
                paths: {$addToSet:"$path"} 
            }).exec(callback);
    }
}

module.exports = speedModel = mongoose.model('Speed', speedSchema, 'speeds');

