/**
 * Created by daisy on 14-6-4.
 */
define(['angular'], function(angular) {
    var account = angular.module('services.user', ['ngResource']);
    account.factory('Account', function($resource){
        return $resource('api/account/check', {}, {
            checkLogin: {
                method:'GET'
            }
        });
    });
    return account;
});
