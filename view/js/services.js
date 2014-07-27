/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'services/look', 'services/user', 'services/setting'], function (angular) {
    'use strict';

    return angular.module('iWomen.services', ['ngResource', 'iWomen.services.look', 'iWomen.services.user', 'iWomen.services.setting'])
        .factory('Response', function () {
            return {
                handle: function (scope, callback) {
                    scope.warning = null;
                    return function (res) {
                        var ok = (res.code === 0);
                        callback(ok, res.data);
                        if (ok) {
                            return;
                        }
                        if (res.code !== 2) {
                            scope.warning = res.msg;
                            return;
                        }
                        require(['socialLogin'], function () {
                            $('#loginModal').modal('show');
                        });
                    }
                }
            }
        });
});