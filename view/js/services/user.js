/**
 * Created by daisy on 14-7-5.
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('iWomen.services.user', ['ngResource'])
        .factory('UserResource', function ($resource) {
            return $resource('api/users', {}, {
                getMyInfo: {
                    method: 'GET'
                }
            })
        })
        .factory('UserService', function ($cacheFactory, UserResource) {
            return {
                getMyInfo: function (callback) {
                    var cache = $cacheFactory.get('users');
                    if (cache) {
                        return callback(cache.get('myInfo'));
                    }
                    cache = $cacheFactory('users');
                    UserResource.getMyInfo({}, function (res) {
                        if (res.code !== 0 || !res.data) {
                            return callback(null);
                        }
                        callback(res.data.user);
                        cache.put('myInfo', res.data.user);
                    });
                }
            };
        });
});