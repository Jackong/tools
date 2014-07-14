/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'controllers/sign', 'controllers/look'], function (angular) {
    'use strict';
    return angular.module('iWomen.controllers',
        ['iWomen.controllers.sign', 'iWomen.controllers.look']
    )
    .controller('AppCtrl', function ($scope, $location, Account) {
        $scope.aria = 10;
        Account.checkLogin(function (data) {
            if (data.code === 0) {
                $location.path('/feed');
            } else {
                $location.path('/sign');
            }
        });
    })
    .controller('RootCtrl', function ($rootScope) {
        var lastScrollY = 0;
        $rootScope.showFooter = true;
        $rootScope.listenScroll = true;
        $rootScope.scroll = function () {
            $rootScope.showFooter = lastScrollY >= window.pageYOffset;
            lastScrollY = window.pageYOffset;
            $rootScope.$apply();
        };
        window.onscroll = $rootScope.scroll;
    });
});