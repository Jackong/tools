/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'angularRoute', 'controllers'], function (angular) {
    'use strict';

    return angular.module('seed.configs', ['ngRoute', 'seed.controllers'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/users/:uid', {
                    templateUrl: 'partials/user.html',
                    controller: 'UserCtrl'
                })
                .otherwise({redirectTo: '/'});
        }]);
});
