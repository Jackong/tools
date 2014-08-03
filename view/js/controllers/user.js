/**
 * Created by daisy on 14-7-31.
 */
define(['angular', 'services', 'services/look', 'services/user'], function (angular) {
    angular.module('iWomen.controllers.user', ['iWomen.services', 'iWomen.services.look', 'iWomen.services.user'])
        .controller('UserCtrl', function ($scope, $routeParams, LookService, UserService) {
            $scope.type = null;
            $scope.change = function (type) {
                $scope.type = type;
                LookService.setType(type);
            };
            $scope.change('wants');

            $scope.uid = $routeParams.uid;
            UserService.getUser($scope.uid, function (user) {
                console.log(user);
                $scope.user = user;
            });
        });
});