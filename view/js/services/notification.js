/**
 * Created by daisy on 14-7-29.
 */
define(['angular'], function (angular) {
    return angular.module('iWomen.services.notification', ['ngResource', 'iWomen.services'])
        .factory('NotificationService', function ($resource, Response) {
            var api = $resource('api/notifications', {}, {
                gets: {
                    method: 'GET'
                },
                read: {
                    method: 'PUT'
                }
            });
            return {
                gets: function (scope, page, num, callback) {
                    api.gets({page: page, num: num}, Response.handle(scope, callback));
                },
                read: function (scope, nids, callback) {
                    api.read({nids: nids}, Response.handle(scope, callback));
                }
            }
        });
});