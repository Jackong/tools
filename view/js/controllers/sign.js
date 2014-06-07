/**
 * Created by daisy on 14-6-7.
 */
define(['app', 'services/user'], function (app) {
    'use strict';

    return app.controller('SignCtrl', function ($scope, $location, md5, Account) {
            var isValid = function () {
                $scope.warning = false;
                if ($scope.sign.$valid) {
                    return true;
                }
                $scope.warning = '账号（邮箱）或密码（至少6位）格式有误，检查一下呗';
                return false;
            };
            $scope.signIn = function () {
                if (!isValid()) {
                    return;
                }
                Account.signIn({account: $scope.account, password: md5.createHash($scope.password)}, function (data) {
                    if (data.code === 0) {
                        $location.path('/where2get');
                    } else {
                        $scope.warning = '哦欧，账号或密码错误';
                    }
                });
            };

            $scope.signUp = function () {
                if (!isValid()) {
                    return;
                }
                Account.signUp({account: $scope.account, password: md5.createHash($scope.password)}, function (data) {
                    if (data.code === 0) {
                        $location.path('/where2get');
                    } else {
                        $scope.warning = '哦欧，这个账号已经被注册了，换一个试试';
                    }
                });
            };

            $scope.forgot = function () {
                $scope.warning = false;
                if (!$scope.sign.$valid) {
                    $scope.warning = '哦欧，邮箱格式输入有误';
                    return;
                }
                Account.forgot({account: $scope.account}, function (data) {
                    $scope.success = {
                        link: 'http://mail.' + $scope.account.split('@')[1].split('.')[0] + '.com',
                        msg: '已发送至邮箱，请确定并重置密码'
                    };
                })
            };
        });
});