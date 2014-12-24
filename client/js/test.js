var app = angular.module('webspeed', ['ngRoute','highcharts-ng']);

// highcharts视图模板
var pieTpl = {
    title: {
        text: ''
    },
    options:
    {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        tooltip: {
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' % ('+ this.y +')';
                    }
                }
            }
        }
    },
    series: [],
    loading : true,
    useHighStocks: false
},lineTpl = {
    title: {
        text: '',
        x: -20 //center
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: '时间 (ms)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    options:{
        tooltip: {
            valueSuffix: 'ms'
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 1
        }
    },
    series: []
};


//路由
app.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'html/env.html'//,
        })

        // route for the plat page
        .when('/platform/:plat', {
            templateUrl : 'html/platform.html'//,
            //controller  : 'platformController'
        })
        .when('/version/:plat/:os_browser/:name', {
            templateUrl : 'html/version.html'//,
            //controller  : 'platformController'
        })
        .when('/pagespeed', {
            templateUrl : 'html/pagespeed.html'//,
            //controller  : 'platformController'
        })
        // // route for the contact page
        // .when('/contact', {
        //     templateUrl : 'pages/contact.html',
        //     controller  : 'contactController'
        // });
});

//共享数据
app.factory('envDataProvider', function($http){
    return $http.get('/api/env');
});

app.factory('pagesDataProvider', function($http){
    return $http.get('/api/pages');
});




//
app.controller('mainController', function($scope, $http) {
    $scope.title = '平台占比';
});

app.controller('envController', function($scope, $location, envDataProvider) {
    $scope.title = '平台占比';
    $('.preloader').hide();
    $scope.chartConfig = angular.copy($.extend({}, pieTpl, {
        title:{
            text: 'pp租车移动和pc流量占比'
        }
    }));

    function setSeries ( envData ) {
        if(!envData){
            return;
        }
        var series = {
            type: 'pie',
            data: [
                ['移动端',envData.mo.count],
                ['PC端',envData.pc.count],
            ],
            point: {
                events:{
                    click: function (event) {
                        //console.log(this);
                        var platform = this.name == '移动端' ? 'mo' : 'pc';
                        $location.path('/platform/'+platform);

                        $scope.$apply();
                    }
                }
            }
        };

        // angular.forEach(envData, function( item ){
        // });

        $scope.chartConfig.series[0] = series;
        $scope.chartConfig.loading = false;
    }

    envDataProvider.success(function(data){
        setSeries( data );
    });

});



app.controller('platformController', function($scope, $location, envDataProvider,$routeParams) {
    // create a message to display in our view
    var plat = $routeParams['plat'];

    $scope.osTitle = '操作系统分布';
    $scope.browserTitle = '浏览器分布';

    $scope.plat = plat;
    $scope.platform = plat == 'mo' ? '移动端' :'PC端';
    $('.preloader').hide();

    $scope.osChartConfig = angular.copy($.extend({}, pieTpl,{
        title:{
            text: 'ppzuche'+ $scope.platform + '操作系统占比'
        }
    }));

    $scope.browserChartConfig = angular.copy($.extend({},pieTpl,{
        title:{
            text: 'ppzuche'+ $scope.platform + '浏览器占比'
        }
    }));

    function setSeries ( envData ) {
        if(!envData){
            return false;
        }
        var osSeries = {
            type: 'pie',
            name: 'osSeries',
            data: [],
            point: {
                events:{
                    click: function (event) {
                        $location.path('/version/'+ plat + '/os/' + this.name );
                        $scope.$apply();
                    }
                }
            }
        },browserSeries = {
            type: 'pie',
            name: 'browserSeries',
            data: [],
            point: {
                events:{
                    click: function (event) {
                        $location.path('/version/'+ plat + '/browser/' + this.name );
                        $scope.$apply();
                    }
                }
            }
        };

        $.each(envData[plat]['os'], function(index, val) {
            osSeries.data.push([val.name,val.count])
        });
        $.each(envData[plat]['browser'], function(index, val) {
            browserSeries.data.push([val.name,val.count])
        });

        $scope.osChartConfig.series[0] = osSeries;
        $scope.osChartConfig.loading = false;

        $scope.browserChartConfig.series[0] = browserSeries;
        $scope.browserChartConfig.loading = false;
        
    }

    envDataProvider.success(function(data){
        setSeries( data );
    });
  
});

app.controller('versionController', function($scope, $location, envDataProvider,$routeParams) {
    // create a message to display in our view
    var plat = $routeParams['plat'],
        os_browser = $routeParams['os_browser'],
        name = $routeParams['name'];

    $scope.title = '版本分布';

    $scope.plat = plat;
    $scope.os_browser = os_browser;
    $scope.name = name;

    $scope.platform = plat == 'mo' ? '移动端' :'PC端';
    $scope.os_or_browser = os_browser == 'os' ? '操作系统' : '浏览器';

    $('.preloader').hide();

    $scope.chartConfig = angular.copy($.extend({}, pieTpl,{
        title:{
            text: 'ppzuche '+ $scope.platform + $scope.os_or_browser + name + '各版本占比'
        }
    }));

    function setSeries ( envData ) {
        if(!envData){
            return false;
        }
        var series = {
            type: 'pie',
            name: 'version',
            data: []
        };

        $.each(envData[plat][os_browser], function(index, val) {
            if(val.name == name){
                $.each(val.version, function(i, el) {
                    series.data.push([el.version,el.count])
                });
                return false;
            }
        });
        

        $scope.chartConfig.series[0] = series;
        $scope.chartConfig.loading = false;
        
    }

    envDataProvider.success(function(data){
        setSeries( data );
    });
  
});



app.controller('speedController', function($scope, $location, pagesDataProvider,$http, $filter) {
    $('.preloader').hide();

    var defaultSerise = ['jsLibLoad', 'firstPaint','domReady','totalDom','totalServer','serverResponse','total'];
    
    $scope.params = {
        platform: 'mo',
        page: '/signup/driver'
    };

    pagesDataProvider.success(function(data){
        $scope.pages = data;
        $scope.curPlatform = data[0];
        $scope.curPagePath = $scope.curPlatform && $scope.curPlatform['paths'][0];
    });

    $scope.$watch('curPlatform', function(){
        $scope.curPagePath = $scope.curPlatform && $scope.curPlatform['paths'][0];
    });

    $scope.$watch('curPagePath', function(newPath){
        if($scope.curPagePath){
            $scope.params.page = newPath;
            $scope.params.platform = $scope.curPlatform._id;
        }
    });

    $scope.$watch('params', function(){
        $http.get('/api/speed', { params: $scope.params}).success(function(data){
            setSeries(data);
        });
    }, true);

    $scope.chartConfig =  $.extend(true, {}, lineTpl, { options: {tooltip: {formatter: function(){ console.log(this); return '<b>'+ this.x + '</b><br>' + this.series.name + ':' + this.y + 'ms <br>样本量：' + this.point.count + '</p>'   } } } })

    function setSeries ( envData ) {
        if(!envData){
            return false;
        }

        var categories = [],
            series = [];


        $.each(envData, function(index, val) {
            categories.push( $filter('date')(new Date(val.date), 'yyyy-MM-dd') );

            for( var i in val ){
                if( !isNaN(val[i].t) ){
                    var obj = ($.grep(series, function( s ){
                        return s.name == i;
                    }))[0];

                    if(!obj){
                        obj = {
                            name: i,
                            visible: defaultSerise.indexOf(i) >= 0,
                            data : []
                        };
                        series.push(obj);
                    }

                    obj.data.push( { y:val[i].t, count: val[i].count });
                }
            }
        });

        $scope.chartConfig.title.text = $scope.curPlatform._id + '端' + $scope.curPagePath  + '性能数据';
        $scope.chartConfig.xAxis.categories = categories;
        $scope.chartConfig.series = series;
        
    }
  
});
