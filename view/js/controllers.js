/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'controllers/look', 'controllers/mine', 'controllers/header', 'services'], function (angular) {
    'use strict';
    return angular.module('iWomen.controllers',
        ['iWomen.services', 'iWomen.controllers.look', 'iWomen.controllers.mine', 'iWomen.controllers.header']
    )
    .controller('RootCtrl', function ($rootScope, UserService) {
        UserService.getMyInfo(function (user) {
            $rootScope.isLogin = (user !== null && typeof user !== 'undefined');
        });
        $rootScope.popover = function (id) {
            $('#' + id).popover('show');
        };
        $rootScope.requireLogin = function () {
            if ($rootScope.isLogin) {
                return true;
            }
            require(['socialLogin'], function () {
                $('#loginModal').modal('show');
            });
            return false;
        };
        var lastScrollY = 0;
        $rootScope.showNav = true;
        $rootScope.scroll = function () {
            $rootScope.showNav = (lastScrollY - window.pageYOffset > 0);
            lastScrollY = window.pageYOffset;
            $rootScope.$apply();
        };
        window.onscroll = $rootScope.scroll;
    });
});