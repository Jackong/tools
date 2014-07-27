/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'services', 'controllers/look'], function (angular) {
    angular.module('iWomen.controllers.header', ['iWomen.services'])
    .controller('ImageCtrl', function ($scope, LookService) {
            $scope.changeImage = LookService.uploadImage;
    })
    .controller('SettingCtrl', function ($scope, $rootScope, SettingService, UserService) {
            $('#settingModal').modal('show');
            SettingService.gets(function (settings) {
                $scope.settings = settings;
            });
            $scope.save = function () {
                var settings = {};
                for(var setting in $scope.settings) {
                    settings[setting] = $scope.settings[setting].enable;
                }
                SettingService.update($scope, settings, function (ok) {
                    if (ok) {
                        $('#settingModal').modal('hide');
                    }
                })
            };
            
            $scope.logout = function () {
                UserService.logout(function () {
                    $rootScope.isLogin = false;
                })
            };
    });
});
