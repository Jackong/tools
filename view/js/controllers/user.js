/**
 * Created by daisy on 14-7-31.
 */
define(['angular', 'services', 'services/look'], function (angular) {
    angular.module('iWomen.controllers.user', ['iWomen.services', 'iWomen.services.look'])
        .controller('UserCtrl', function ($scope, LookService) {
            $scope.type = null;
            $scope.change = function (type) {
                $scope.type = type;
                LookService.setType(type);
            };
            $scope.change('wants');
        });
});