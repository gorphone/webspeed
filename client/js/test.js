var app = angular.module('webspeed', ['ngRoute','highcharts-ng']);

app.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'html/home.html',
            controller  : 'mainController'
        })

        // // route for the about page
        // .when('/about', {
        //     templateUrl : 'pages/about.html',
        //     controller  : 'aboutController'
        // })

        // // route for the contact page
        // .when('/contact', {
        //     templateUrl : 'pages/contact.html',
        //     controller  : 'contactController'
        // });
});

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $http) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';

    $('.preloader').hide();

    $http.get('/api').
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
    });


    $scope.chartConfig = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }],

        loading: true
    };

   
});