/* 
* @Author: gaofeng
* @Date:   2014-12-02 11:24:20
* @Last Modified by:   anchen
* @Last Modified time: 2014-12-05 12:06:37
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    envSchema = new mongoose.Schema({
        'date' : Date,
        'mo' : {
            'browser':[{
                'name' : String,
                'count':Number,
                'version':[{
                    'version': String,
                    'count' : Number 
                }]
            }],
            'os':[{
                'name' : String,
                'count':Number,
                'version':[{
                    'version': String,
                    'count' : Number 
                }]
            }],
            'count': Number
        },
        'pc' : {
            'browser':[{
                'name' : String,
                'count':Number,
                'version':[{
                    'version': String,
                    'count' : Number 
                }]
            }],
            'os':[{
                'name' : String,
                'count':Number,
                'version':[{
                    'version': String,
                    'count' : Number 
                }]
            }],
            'count': Number
        }
    },{autoIndex:true}),
    envModel;

envSchema.statics = {
    getByDate: function (date, callback) {
        console.log(date);
        var start = new Date( date + " 00:00:00" ),
            end = new Date ( date + " 23:59:59" );

        this.findOne({date: { $gte: start, $lte: end}}, callback)
    }
}

module.exports = envModel = mongoose.model('env', envSchema)
