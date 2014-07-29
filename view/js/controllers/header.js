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
    })
    .controller('NotificationCtrl', function ($scope) {
            $scope.num = 1;
            $scope.popover = function () {
                var content = '<div class="media">' +
                    '<a class="pull-left" href="#">' +
                    '<img class="media-object" src="..." alt="...">' +
                    '</a>' +
                    '<div class="media-body">' +
                    '<h6 class="media-heading">Daisy</h6>' +
                    '<a href="#/looks/">喜欢了你发布的宝贝</a>' +
                    '</div>' +
                    '</div>';
                $('#notification')
                .popover({
                    html: true,
                    content: content
                })
                .popover('toggle');
                $scope.num = 0;
            }
    });
});
