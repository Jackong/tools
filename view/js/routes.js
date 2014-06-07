define(['app', 'services/user', 'controllers/sign', 'controllers/where2get'], function (app) {
    'use strict';

    return app
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'partials/app.html',
                    controller: 'AppCtrl'
                })
                .when('/sign', {
                    templateUrl: 'partials/sign.html',
                    controller: 'SignCtrl'
                })
                .when('/feed', {
                    templateUrl: 'partials/where2get.html',
                    controller: 'Where2GetCtrl'
                })
                .when('/account/forgot', {
                    templateUrl: 'partials/forgot.html',
                    controller: 'SignCtrl'
                })
                .otherwise({redirectTo: '/'});
        }])
        .controller('AppCtrl', function ($scope, $location, Account) {
            $scope.aria = 10;
            Account.checkLogin(function (data) {
                if (data.code === 0) {
                    $location.path('/feed');
                } else {
                    $location.path('/sign');
                }
            });
        });

});