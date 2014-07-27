/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'services'], function (angular) {
    'use strict';

    return angular.module('iWomen.services.setting', ['ngResource', 'iWomen.services'])
        .factory('SettingResource', function ($resource) {
            return $resource('api/settings', {}, {
                gets: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT'
                }
            })
        })
        .factory('SettingService', function ($cacheFactory, Response, SettingResource) {
            return {
                gets: function (callback) {
                    var cache = $cacheFactory.get('settings');
                    if (cache) {
                        return callback(cache.get('mine'));
                    }
                    cache = $cacheFactory('settings');
                    SettingResource.gets(function (res) {
                        if (res.code !== 0 || !res.data) {
                            return callback(null);
                        }
                        callback(res.data.settings);
                        cache.put('mine', res.data.settings);
                    });
                },
                update: function (scope, settings, callback) {
                    SettingResource.update({settings: settings}, Response.handle(scope, callback));
                }
            };
        });
});