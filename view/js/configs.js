/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'angularRoute', 'controllers'], function (angular) {
    'use strict';

    return angular.module('iWomen.configs', ['ngRoute', 'iWomen.controllers'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/fashion', {
                    templateUrl: 'partials/fashion.html',
                    controller: 'FashionCtrl'
                })
                .when('/newest', {
                    templateUrl: 'partials/newest.html',
                    controller: 'NewestCtrl'
                })
                .when('/looks/:lookId', {
                    templateUrl: 'partials/look.html',
                    controller: 'LookDetailCtrl'
                })
                .when('/wants', {
                    templateUrl: 'partials/mine/wants.html',
                    controller: 'WantsCtrl'
                })
                .when('/likes', {
                    templateUrl: 'partials/mine/likes.html',
                    controller: 'LikesCtrl'
                })
                .when('/tips', {
                    templateUrl: 'partials/mine/tips.html',
                    controller: 'TipsCtrl'
                })
                .otherwise({redirectTo: '/fashion'});
        }]);
});