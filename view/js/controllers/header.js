/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'services'], function (angular) {
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
                UserService.logout(function (ok) {
                    $rootScope.isLogin = false;
                    if (ok) {
                        $('#settingModal').modal('hide');
                    }
                })
            };
    })
    .controller('NotificationCtrl', function ($scope, NotificationService) {
            var action = function (action) {
                switch (action) {
                    case 1: return '喜欢了我的小贴士';
                    case 2: return '评论了我的小贴士';
                    case 3: return '喜欢了我发的宝贝';
                    case 4: return '告诉了我哪儿有我想要的宝贝';
                    case 5: return '想要我发的宝贝';
                }
            };

            NotificationService.gets($scope, 0, 10, function (ok, data) {
                $scope.notifications = data.notifications;
                $scope.num = $scope.notifications.length;
                if ($scope.num === 0) {
                    return;
                }
                var content = '<ul class="media-list">';
                for(var idx = 0; idx < $scope.num; idx++) {
                    var notification = $scope.notifications[idx];
                    content += '<li class="media">' +
                        '<a class="pull-left" href="#/users/'+ notification.from._id +'">' +
                        '<img class="media-object img-circle img-responsive" src="' + notification.from.avatar + '" alt="">' +
                        '</a>' +
                        '<div class="media-body">' +
                        '<h6 class="media-heading">'+ notification.from.nick +'</h6>' +
                        '<a href="#/looks/'+ notification.look +'">' + action(notification.action) + '</a>' +
                        '</div>' +
                        '</li>';
                }
                content += '</ul>';
                $('#notification')
                .on('hidden.bs.popover', function () {
                    $scope.num = 0;
/*                    NotificationService.read($scope, $scope.notifications, function (ok, data) {

                    });*/
                    $scope.$apply();
                })
                .popover({
                    html: true,
                    content: content === '' ? '没有新提醒~' : content
                });
            });

            $scope.popover = function () {
                if ($scope.num <= 0) {
                    return;
                }
                $('#notification').popover('show');
            };
    });
});
