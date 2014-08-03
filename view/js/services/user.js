/**
 * Created by daisy on 14-7-5.
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('iWomen.services.user', ['ngResource'])
        .factory('UserResource', function ($resource) {
            return $resource('api/users/:uid', {}, {
                getInfo: {
                    method: 'GET'
                },
                logout: {
                    method: 'PUT',
                    url: 'api/accounts/logout'
                }
            })
        })
        .factory('UserService', function ($cacheFactory, UserResource) {
            return {
                getMyInfo: function (callback) {
                    var cache = $cacheFactory.get('users');
                    if (!cache) {
                        cache = $cacheFactory('users');
                    }
                    var uid = cache.get('uid');
                    if (uid) {
                        return this.getUser(uid, callback);
                    }
                    this.getUser(undefined, function (user) {
                        cache.put('uid', uid);
                        callback(user);
                    });
                },
                getUser: function (uid, callback) {
                    var cache = $cacheFactory.get('users');
                    if (!cache) {
                        cache = $cacheFactory('users');
                    }
                    if (uid) {
                        var user = cache.get(uid);
                        if (user) {
                            return callback(user);
                        }
                    }
                    UserResource.getInfo({uid: uid}, function (res) {
                        if (res.code !== 0 || !res.data) {
                            return callback(null);
                        }
                        cache.put(uid, res.data.user);
                        callback(res.data.user);
                    });
                },
                logout: function (callback) {
                    UserResource.logout(callback);
                }
            };
        });
});