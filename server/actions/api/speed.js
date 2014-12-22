/* 
* @Author: gaofeng
* @Date:   2014-12-15 12:30:31
* @Last Modified time: 2014-12-15 16:02:21
*/

var Speed = require('../../model/speed.js');

module.exports = {
    speed: function(req, res) {
        var query = req.query;

        Speed.getSpeedOfPage ( query, function(err, data){
            //console.log(err);
            if(!err){
                res.json(data);
            }else{
                console.log(err);
            }
        });
    },

    pages : function( req, res ){
        console.log(10232);
        Speed.getPages(function(err, data){
            console.log( 'calling' );
            if(!err){
                console.log(data);
                res.json(data);
            }else{
                console.log(err);
            }
        });
    }
}
