/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'services/look'], function (angular) {
    'use strict';

    return angular.module('iWomen.services', ['ngResource', 'iWomen.services.look'])
        .factory('Account', function ($resource) {
            return $resource('api/users', {}, {
                getMyInfo: {
                    method: 'GET'
                }
            })
        })
        .factory('Tip', function ($resource) {
            return $resource('api/tips/:tipIds', {}, {
                getsByIds: {
                    method: 'GET', url: 'api/looks/:lookId/favorites/:aspect/tips/:tipIds'
                },
                comment: {
                    method: 'PUT', url: 'api/tips/comments'
                }
            });
        })
        .factory('AccountCache', function ($cacheFactory, Account) {
            return {
                getMyInfo: function (callback) {
                    var cache = $cacheFactory.get('users');
                    if (cache) {
                        return callback(cache.get('myInfo'));
                    }
                    cache = $cacheFactory('users');
                    Account.getMyInfo({}, function (res) {
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