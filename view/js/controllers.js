/**
 * Created by daisy on 14-6-7.
 */
define(['angular', 'services/user'], function (angular) {
    'use strict';

    return angular.module('controllers', ['services.user'])
        .controller('AppCtrl', function ($scope, $location, Account) {
            var data = Account.checkLogin();
            if (data.code === 0) {
                $location.path('/where2get');
            } else {
                $location.path('/sign');
            }
        })
        .controller('Where2GetCtrl', function ($scope) {

        })
        .controller('SignCtrl', function ($scope, $location) {

        });
});