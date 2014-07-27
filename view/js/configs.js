/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'angularRoute', 'controllers'], function (angular) {
    'use strict';

    return angular.module('iWomen.configs', ['ngRoute', 'iWomen.controllers'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/fashion', {
                    templateUrl: 'partials/look/list.html',
                    controller: 'FashionCtrl'
                })
                .when('/newest', {
                    templateUrl: 'partials/look/list.html',
                    controller: 'NewestCtrl'
                })
                .when('/looks/:lookId', {
                    templateUrl: 'partials/look/detail.html',
                    controller: 'LookDetailCtrl'
                })
                .otherwise({redirectTo: '/fashion'});
        }]);
});