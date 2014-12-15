/* 
* @Author: gaofeng
* @Date:   2014-12-08 17:02:13
* @Last Modified time: 2014-12-09 20:49:08
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
    getByDate: function (date, callback) {
        console.log(date);
        var start = new Date( date + " 00:00:00" ),
            end = new Date ( date + " 23:59:59" );

        this.findOne({date: { $gte: start, $lte: end}}, callback)
    }
}

module.exports = speedModel = mongoose.model('Speed', speedSchema, 'speeds');

