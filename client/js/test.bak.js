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
            plotShadow: false,
            type:'pie'
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
            templateUrl : 'html/home.html'//,
            //controller  : 'envController'
        })

        // route for the about page
        .when('/platform/:plat', {
            templateUrl : 'html/plat_mo.html'//,
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
            text: 'pp 租车移动和pc流量占比'
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
        var colors = Highcharts.getOptions().colors,
            osSeries = [{
                name: 'Os',
                data: [],
                size: '60%',
                dataLabels: {
                    formatter: function () {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: 'white',
                    distance: -30
                }
            },{
                name: 'Versions',
                data: [],
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                    formatter: function () {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%'  : null;
                    }
                }
            }],
            browserSeries = [{
                name: 'Browser',
                data: [],
                size: '60%',
                dataLabels: {
                    formatter: function () {
                        return this.point.name ;
                    },
                    color: 'white',
                    distance: -30
                }
            },{
                name: 'Versions',
                data: [],
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                    formatter: function () {
                        // display only if larger than 1
                        return '<b>' + this.point.name + ':</b> ' + this.y + '%' ;
                    }
                }
            }];

        $.each(envData[plat]['os'], function(index, val) {
            osSeries[0].data.push({
                name: val.name,
                y: val.count,
                color: colors[index]
            });

            $.each(val.version,function(i, el) {
                osSeries[1].data.push({
                    name: el.version,
                    y: el.count,
                    color: colors[i]
                });
            });
        });
        $.each(envData[plat]['browser'], function(index, val) {
            browserSeries[0].data.push({
                name: val.name,
                y: val.count,
                color: colors[index]
            });

            $.each(val.version, function(i, el) {
                browserSeries[1].data.push({
                    name: el.version,
                    y: el.count,
                    color: colors[i]
                });
            });
        });

        $scope.osChartConfig.series = osSeries;
        $scope.osChartConfig.loading = false;

        $scope.browserChartConfig.series = browserSeries;
        $scope.browserChartConfig.loading = false;
        
    }

    envDataProvider.success(function(data){
        setSeries( data );
    });
  
});
