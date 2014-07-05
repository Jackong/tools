/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'angularResource'], function (angular) {
    'use strict';

    return angular.module('iWomen.services', ['ngResource'])
        .factory('Account', function ($resource) {
            return $resource('api/accounts/:account', {}, {
                signUp: {
                    method: 'POST'
                },
                signIn: {
                    method: 'GET'
                },
                checkLogin: {
                    method: 'GET', url: 'api/accounts/check'
                },
                updatePassword: {
                    method: 'PUT'
                },
                forgot: {
                    method: 'GET', url: 'api/accounts/forgot/:account'
                }
            })
        })
        .factory('Look', function ($resource) {
            return $resource('api/looks/:type')
        });
});