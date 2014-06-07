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
                .when('/mine', {
                    templateUrl: 'partials/mine.html',
                    controller: 'MineCtrl'
                })
                .when('/where2get', {
                    templateUrl: 'partials/where2get.html',
                    controller: 'Where2GetCtrl'
                })
                .otherwise({redirectTo: '/'});
        }])
        .controller('AppCtrl', function ($scope, $location, Account) {
            $scope.aria = 10;
            Account.checkLogin(function (data) {
                if (data.code === 0) {
                    $location.path('/where2get');
                } else {
                    $location.path('/sign');
                }
                $scope.$apply();
            });
        });

});