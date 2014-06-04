/**
 * Created by daisy on 14-6-4.
 */
angular.module('accountService', ['ngResource'])
.factory('Account', ['$resource',
    function($resource){
        return $resource('accounts', {}, {
            query: {
                method:'GET', isArray:true
            }
        });
}]);