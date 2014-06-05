/**
 * Created by daisy on 14-6-4.
 */
define(['lib/angular.min', 'lib/angular-resource.min'], function() {
    var account = angular.module('accountService', ['ngResource']);
    account.factory('Account', ['$resource',
        function($resource){
            return $resource('accounts', {}, {
                query: {
                    method:'GET', isArray:true
                }
            });
        }]);
    return account;
});
