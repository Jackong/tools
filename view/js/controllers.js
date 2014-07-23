/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'controllers/look'], function (angular) {
    'use strict';
    return angular.module('iWomen.controllers',
        ['iWomen.controllers.look']
    )
    .controller('RootCtrl', function ($rootScope) {
        require(['socialLogin'], function () {});
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