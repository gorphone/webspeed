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
