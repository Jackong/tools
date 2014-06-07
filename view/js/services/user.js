/**
 * Created by daisy on 14-6-4.
 */
define(['angular'], function(angular) {
    'use strict';

    var account = angular.module('services.user', ['ngResource']);
    account
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
                }
            })
        });
    return account;
});
