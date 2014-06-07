/**
 * Created by daisy on 14-6-4.
 */
define(['app'], function (app) {
    'use strict';

    return app.factory('Account', function ($resource) {
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
});
