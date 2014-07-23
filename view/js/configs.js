/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'angularRoute'], function (angular) {
    'use strict';

    return angular.module('iWomen.configs', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'partials/where2get.html',
                    controller: 'TrendCtrl'
                })
                .when('/looks/:lookId', {
                    templateUrl: 'partials/where2get.html',
                    controller: 'LookDetailCtrl'
                })
                .otherwise({redirectTo: '/'});
        }]);
});